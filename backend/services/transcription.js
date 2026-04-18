const Groq = require("groq-sdk");
const fs = require("fs");
require("dotenv").config();

class TranscriptionService {
  constructor() {
    if (!process.env.GROQ_API_KEY) {
      console.warn("⚠️ GROQ_API_KEY missing");
      this.client = null;
    } else {
      this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
  }

  async transcribe(audioPath) {
    if (!this.client) {
      throw new Error("Groq API Key not configured");
    }

    if (!audioPath || !fs.existsSync(audioPath)) {
      throw new Error("Invalid or missing audio file for transcription");
    }

    try {
      console.log("🎙️ Sending audio to Groq...");

      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-large-v3",
        response_format: "verbose_json"
      });

      if (!transcription) {
        throw new Error("Empty transcription response from Groq");
      }

      return transcription;
    } catch (error) {
      console.error("❌ Transcription error:", error.message);
      throw error;
    }
  }

  processSegments(results) {
    if (!results || !results.segments) {
      throw new Error("Invalid transcription format: missing segments");
    }

    const segments = results.segments.map(segment => ({
      content: (segment.text || "").trim(),
      start_time: segment.start || 0,
      end_time: segment.end || 0,
      speaker: "Speaker 1"
    }));

    if (segments.length === 0) {
      throw new Error("No valid transcript segments found");
    }

    return segments;
  }
}

module.exports = new TranscriptionService();
