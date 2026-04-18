const express = require('express');
const router = express.Router();
const { Session, TranscriptChunk, Summary, ActionItem, Concept } = require('../models');
const { processVideoAsync } = require('../services/processor');
const manager = require('../services/sockets');

// POST /api/v1/sessions/process
router.post('/process', async (req, res) => {
  try {
    const { url, title } = req.body;
    
    // Create session record
    const session = await Session.create({
      title: title || "New Analysis",
      source_url: url,
      source_type: "youtube",
      status: "pending"
    });

    // Spawn background task (don't await)
    processVideoAsync(session.id, manager);

    res.status(201).json(session);
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/v1/sessions/:id
router.get('/:id', async (req, res) => {
  try {
    const session = await Session.findByPk(req.params.id, {
      include: [
        { model: TranscriptChunk, as: 'transcript_chunks' },
        { model: Summary, as: 'summaries' },
        { model: ActionItem, as: 'action_items' },
        { model: Concept, as: 'concepts' }
      ]
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // Format summaries for frontend convenience
    const summaryMap = {};
    (session.summaries || []).forEach(s => {
      summaryMap[s.mode] = s.content;
    });

    res.json({
      id: session.id,
      title: session.title,
      status: session.status,
      source_url: session.source_url,
      transcript: session.transcript_chunks,
      summaries: summaryMap,
      action_items: session.action_items,
      concepts: session.concepts
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
