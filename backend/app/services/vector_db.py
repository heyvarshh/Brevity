import numpy as np
from typing import List, Dict, Any

class VectorDB:
    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self.vectors = []
        self.metadata = []

    def add_embeddings(self, embeddings: List[List[float]], metadata: List[Dict[str, Any]]):
        """
        Adds embeddings and associated metadata to the in-memory store.
        """
        if not embeddings:
            return
            
        self.vectors.extend(embeddings)
        self.metadata.extend(metadata)

    def search(self, query_embedding: List[float], k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches for the k most similar chunks using simple NumPy cosine similarity.
        """
        if not self.vectors:
            return []
            
        # Convert to numpy for vector operations
        vectors_np = np.array(self.vectors)
        query_np = np.array(query_embedding)
        
        # Calculate cosine similarity: (A . B) / (||A|| * ||B||)
        dot_product = np.dot(vectors_np, query_np)
        norms = np.linalg.norm(vectors_np, axis=1) * np.linalg.norm(query_np)
        similarities = dot_product / (norms + 1e-9)
        
        # Get top k indices
        top_indices = np.argsort(similarities)[-k:][::-1]
        
        results = []
        for idx in top_indices:
            results.append({
                "metadata": self.metadata[idx],
                "score": float(similarities[idx])
            })
        return results

    def save(self, path: str):
        # Persistent VDB disabled for lightweight version to save disk space
        pass

    def load(self, path: str):
        pass

vector_db = VectorDB()
