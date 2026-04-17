import faiss
import numpy as np
import os
import pickle
from typing import List, Dict, Any

class VectorDB:
    def __init__(self, dimension: int = 1536):
        self.dimension = dimension
        self.index = faiss.IndexFlatIP(dimension) # Inner Product (for cosine similarity with normalized vectors)
        self.metadata = [] # Stores mapping from index to transcript_chunk_id

    def add_embeddings(self, embeddings: List[List[float]], metadata: List[Dict[str, Any]]):
        """
        Adds embeddings and associated metadata to the index.
        """
        if not embeddings:
            return
            
        embeddings_np = np.array(embeddings).astype('float32')
        # Normalize for cosine similarity
        faiss.normalize_L2(embeddings_np)
        
        self.index.add(embeddings_np)
        self.metadata.extend(metadata)

    def search(self, query_embedding: List[float], k: int = 5) -> List[Dict[str, Any]]:
        """
        Searches for the k most similar chunks to the query embedding.
        """
        query_np = np.array([query_embedding]).astype('float32')
        faiss.normalize_L2(query_np)
        
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for i in range(len(indices[0])):
            idx = indices[0][i]
            if idx != -1: # FAISS returns -1 if not enough results
                results.append({
                    "metadata": self.metadata[idx],
                    "score": float(distances[0][i])
                })
        return results

    def save(self, path: str):
        if not os.path.exists(os.path.dirname(path)):
            os.makedirs(os.path.dirname(path))
        faiss.write_index(self.index, f"{path}.index")
        with open(f"{path}.meta", "wb") as f:
            pickle.dump(self.metadata, f)

    def load(self, path: str):
        if os.path.exists(f"{path}.index"):
            self.index = faiss.read_index(f"{path}.index")
            with open(f"{path}.meta", "rb") as f:
                self.metadata = pickle.load(f)

vector_db = VectorDB()
