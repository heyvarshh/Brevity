from groq import Groq
from app.core.config import settings
from typing import List, Dict, Any

class TranscriptionService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

    def transcribe(self, audio_path: str) -> Dict[str, Any]:
        """
        Transcribes audio using Groq Cloud (Whisper-large-v3).
        """
        if not self.client:
            raise ValueError("Groq API Key not configured")

        with open(audio_path, "rb") as file:
            transcription = self.client.audio.transcriptions.create(
                file=(audio_path, file.read()),
                model="whisper-large-v3",
                response_format="verbose_json",
            )
        # Groq returns an object, we convert to dict for compatibility
        return transcription.to_dict()

    def process_segments(self, results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Cleans and formats segments for DB storage.
        """
        segments = []
        for segment in results.get("segments", []):
            segments.append({
                "content": segment["text"].strip(),
                "start_time": segment["start"],
                "end_time": segment["end"],
                "speaker": "Unknown"
            })
        return segments

transcription_service = TranscriptionService()
