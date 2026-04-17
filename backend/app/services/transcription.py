import whisper
import torch
from typing import List, Dict, Any

class TranscriptionService:
    def __init__(self, model_size: str = "base"):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = whisper.load_model(model_size, device=self.device)

    def transcribe(self, audio_path: str) -> Dict[str, Any]:
        """
        Transcribes audio using Whisper.
        Returns a transcript with word-level segments and timestamps.
        """
        results = self.model.transcribe(audio_path, verbose=False)
        return results

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
                "speaker": "Unknown" # Diarization will update this later
            })
        return segments

transcription_service = TranscriptionService()
