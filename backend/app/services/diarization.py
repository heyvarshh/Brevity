from typing import List, Dict, Any, Optional

class DiarizationService:
    def __init__(self, hf_token: Optional[str] = None):
        # Local diarization is disabled for Render Free Tier (requires too much RAM)
        self.pipeline = None

    def process(self, audio_path: str) -> List[Dict[str, Any]]:
        """
        Diarization is disabled in the lightweight version.
        """
        return []

    @staticmethod
    def match_speakers(segments: List[Dict[str, Any]], diarization_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Matches transcript segments to diarization tracks.
        (Always Unknown for lightweight version)
        """
        for seg in segments:
            seg["speaker"] = "Speaker 1"
        return segments

diarization_service = DiarizationService()
