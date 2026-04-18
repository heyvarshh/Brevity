const OpenAI = require("openai");
require('dotenv').config();

class EmbeddingService {
  constructor() {
    this.client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
  }

  async getEmbeddings(texts) {
    if (!this.client || !texts || texts.length === 0) {
      return [];
    }

    try {
      const response = await this.client.embeddings.create({
        input: texts,
        model: "text-embedding-3-small",
      });
      return response.data.map(item => item.embedding);
    } catch (error) {
      console.error("Error in OpenAI embeddings:", error);
      return [];
    }
  }
}

module.exports = new EmbeddingService();
