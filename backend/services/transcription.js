const Groq = require("groq-sdk");
const fs = require('fs');
require('dotenv').config();

class TranscriptionService {
  constructor() {
    this.client = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
  }

  async transcribe(audioPath) {
    if (!this.client) {
      throw new Error("Groq API Key not configured");
    }

    try {
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-large-v3",
        response_format: "verbose_json",
      });
      return transcription;
    } catch (error) {
      console.error("Error in Groq transcription:", error);
      throw error;
    }
  }

  processSegments(results) {
    const segments = [];
    (results.segments || []).forEach(segment => {
      segments.push({
        content: segment.text.trim(),
        start_time: segment.start,
        end_time: segment.end,
        speaker: "Speaker 1" // Diarization disabled in lightweight mode
      });
    });
    return segments;
  }
}

module.exports = new TranscriptionService();
