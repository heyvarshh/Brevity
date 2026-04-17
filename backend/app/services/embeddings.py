from openai import OpenAI
from app.core.config import settings
from typing import List

class EmbeddingService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def get_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Generates embeddings for a list of texts using OpenAI.
        """
        if not self.client:
            # Fallback or error
            return []
            
        response = self.client.embeddings.create(
            input=texts,
            model="text-embedding-3-small"
        )
        return [data.embedding for data in response.data]

embedding_service = EmbeddingService()
