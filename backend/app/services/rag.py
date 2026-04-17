from openai import OpenAI
from app.core.config import settings
from app.services.embeddings import embedding_service
from app.services.vector_db import VectorDB
from typing import List, Dict, Any

class RAGService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

    def answer_question(self, session_id: int, question: str) -> Dict[str, Any]:
        """
        Answers a question about a session using RAG.
        Returns the answer and timestamp citations.
        """
        if not self.client:
            return {"answer": "LLM not configured.", "citations": []}

        # 1. Load Index
        vdb = VectorDB()
        vdb.load(f"/tmp/deepdive/index_{session_id}")
        
        # 2. Get Query Embedding
        query_emb = embedding_service.get_embeddings([question])[0]
        
        # 3. Retrieve chunks
        relevant_chunks = vdb.search(query_emb, k=5)
        
        # 4. Construct Context
        context = ""
        citations = []
        for res in relevant_chunks:
            meta = res["metadata"]
            context += f"[{meta['start']}] {meta['text']}\n"
            citations.append({"timestamp": meta['start'], "text": meta['text']})

        # 5. Generate Answer
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Answer the question based ONLY on the provided context with timestamps. Always include timestamp citations in your answer like [12.5]."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {question}"}
            ]
        )
        
        return {
            "answer": response.choices[0].message.content,
            "citations": citations
        }

rag_service = RAGService()
