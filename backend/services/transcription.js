const Groq = require("groq-sdk");
const fs = require("fs");
require("dotenv").config();

class TranscriptionService {
  constructor() {
    const key = process.env.GROQ_API_KEY;

    if (!key) {
      console.warn("⚠️ GROQ_API_KEY is missing");
      this.client = null;
    } else {
      this.client = new Groq({ apiKey: key });
    }
  }

  async transcribe(audioPath) {
    try {
      if (!this.client) {
        throw new Error("Groq API key not configured");
      }

      if (!audioPath || !fs.existsSync(audioPath)) {
        throw new Error("Invalid audio file path");
      }

      console.log("🎙️ Transcription started...");

      const result = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-large-v3",
        response_format: "verbose_json"
      });

      if (!result) {
        throw new Error("Empty transcription response");
      }

      console.log("✅ Transcription completed");

      return result;
    } catch (error) {
      console.error("❌ Transcription failed:", error.message);
      throw error;
    }
  }

  processSegments(results) {
    if (!results || !results.segments) {
      throw new Error("Invalid transcription format (no segments)");
    }

    const segments = results.segments.map(seg => ({
      content: (seg.text || "").trim(),
      start_time: seg.start || 0,
      end_time: seg.end || 0,
      speaker: "Speaker 1"
    }));

    if (segments.length === 0) {
      throw new Error("No valid transcript segments found");
    }

    return segments;
  }
}

module.exports = new TranscriptionService();
