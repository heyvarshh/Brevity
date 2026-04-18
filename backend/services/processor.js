const fs = require('fs');
const path = require('path');
const { Session, TranscriptChunk, Summary, ActionItem, Concept } = require('../models');
const downloaderService = require('./downloader');
const transcriptionService = require('./transcription');
const llmService = require('./llm');
const embeddingService = require('./embeddings');
const vectorDb = require('./vector_db');
const sequelize = require('../config/db');

async function processVideoAsync(sessionId, manager) {
  try {
    const session = await Session.findByPk(sessionId);
    if (!session) return "Session not found";

    // 1. Download
    session.status = "downloading";
    await session.save();
    manager.broadcast(sessionId, { status: "downloading", progress: 10 });

    const tempDir = "/tmp/brevity";
    const audioPath = await downloaderService.getYoutubeAudio(session.source_url, tempDir);
    
    if (!audioPath) {
      session.status = "failed";
      await session.save();
      manager.broadcast(sessionId, { status: "failed", error: "Download failed" });
      return;
    }

    // 2. Transcribe
    session.status = "transcribing";
    await session.save();
    manager.broadcast(sessionId, { status: "transcribing", progress: 30 });

    const rawTranscript = await transcriptionService.transcribe(audioPath);
    const segments = transcriptionService.processSegments(rawTranscript);

    // 3. Save Chunks
    const transaction = await sequelize.transaction();
    try {
      for (const seg of segments) {
        await TranscriptChunk.create({
          content: seg.content,
          start_time: seg.start_time,
          end_time: seg.end_time,
          speaker: seg.speaker,
          session_id: sessionId
        }, { transaction });
      }
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    // 4. Intelligence & Knowledge
    manager.broadcast(sessionId, { status: "extracting", progress: 70 });
    const fullText = segments.map(s => s.content).join(" ");

    // Summaries
    for (const mode of ["quick", "structured", "meeting"]) {
      const content = await llmService.summarize(fullText, mode);
      await Summary.create({ mode, content, session_id: sessionId });
    }

    // Intelligence
    const intel = await llmService.extractIntelligence(fullText);
    for (const item of (intel.action_items || [])) {
      await ActionItem.create({
        content: item.content,
        type: item.type,
        assignee: item.assignee,
        session_id: sessionId
      });
    }
    for (const con of (intel.concepts || [])) {
      await Concept.create({
        name: con.name,
        description: con.description,
        session_id: sessionId
      });
    }

    // 5. Indexing
    manager.broadcast(sessionId, { status: "indexing", progress: 90 });
    const embeddings = await embeddingService.getEmbeddings(segments.map(s => s.content));
    if (embeddings.length > 0) {
      vectorDb.addEmbeddings(embeddings, segments.map(s => ({
        session_id: sessionId,
        text: s.content,
        start: s.start_time
      })));
    }

    // 6. Finalize
    session.status = "completed";
    await session.save();
    manager.broadcast(sessionId, { status: "completed", progress: 100 });

    // Cleanup
    if (fs.existsSync(audioPath)) {
      fs.unlinkSync(audioPath);
    }

  } catch (error) {
    console.error(`Error processing session ${sessionId}:`, error);
    const session = await Session.findByPk(sessionId);
    if (session) {
      session.status = "failed";
      await session.save();
    }
    manager.broadcast(sessionId, { status: "failed", error: error.message });
  }
}

module.exports = { processVideoAsync };
