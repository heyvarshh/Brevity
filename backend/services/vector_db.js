class VectorDB {
  constructor() {
    this.vectors = [];
    this.metadata = [];
  }

  addEmbeddings(embeddings, metadata) {
    if (!embeddings || embeddings.length === 0) return;
    this.vectors.push(...embeddings);
    this.metadata.push(...metadata);
  }

  // Cosine Similarity implementation in JS
  dotProduct(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }

  magnitude(a) {
    return Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  }

  cosineSimilarity(a, b) {
    const magA = this.magnitude(a);
    const magB = this.magnitude(b);
    if (magA === 0 || magB === 0) return 0;
    return this.dotProduct(a, b) / (magA * magB);
  }

  search(queryEmbedding, k = 5) {
    if (this.vectors.length === 0) return [];

    const similarities = this.vectors.map((vec, i) => ({
      metadata: this.metadata[i],
      score: this.cosineSimilarity(vec, queryEmbedding)
    }));

    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}

module.exports = new VectorDB();
