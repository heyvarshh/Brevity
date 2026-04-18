const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class LLMService {
  constructor() {
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } else {
      this.model = null;
    }
  }

  async summarize(text, mode) {
    const prompts = {
      quick: "Give a 5-bullet TL;DR summary of this transcript.",
      structured: "Generate structured deep notes with Headings, Subtopics, Key points, and Examples.",
      exam: "Generate exam revision notes: Concepts, definitions, formulas, and Q&A pairs.",
      meeting: "Extract meeting details: Decisions made, open questions, and owner assignments.",
      eli5: "Explain the content like I'm 5 years old.",
      executive: "Create a 1-page business brief including decisions and next steps."
    };

    const promptText = prompts[mode] || prompts["quick"];

    if (!this.model) {
      return `Gemini API key not configured. Content summary for mode: ${mode}`;
    }

    try {
      const result = await this.model.generateContent(`${promptText}\n\nTranscript:\n${text}`);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error in LLM summarize:", error);
      return `Error generating summary: ${error.message}`;
    }
  }

  async extractIntelligence(text) {
    if (!this.model) {
      return { action_items: [], concepts: [] };
    }

    const prompt = `
      Extract actionable intelligence from the following transcript. 
      Return the result ONLY as a JSON object with these keys: 
      "action_items": [{ "content": string, "type": "task"|"follow-up"|"decision"|"question", "assignee": string|null }]
      "concepts": [{ "name": string, "description": string }]

      Transcript:
      ${text}
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let jsonStr = response.text().trim();
      
      // Cleanup markdown code blocks if present
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
      } else if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
      }

      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Error in LLM extractIntelligence:", error);
      return { action_items: [], concepts: [] };
    }
  }
}

module.exports = new LLMService();
