import torch
from pyannote.audio import Pipeline
from typing import List, Dict, Any, Optional

class DiarizationService:
    def __init__(self, hf_token: Optional[str] = None):
        if hf_token:
            self.pipeline = Pipeline.from_pretrained(
                "pyannote/speaker-diarization-3.1",
                use_auth_token=hf_token
            )
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            if self.pipeline:
                self.pipeline.to(device)
        else:
            self.pipeline = None

    def process(self, audio_path: str) -> List[Dict[str, Any]]:
        """
        Diarizes audio to identify who spoke when.
        """
        if not self.pipeline:
            return []
            
        diarization = self.pipeline(audio_path)
        
        results = []
        for turn, _, speaker in diarization.itertracks(yield_label=True):
            results.append({
                "start": turn.start,
                "end": turn.end,
                "speaker": speaker
            })
        return results

    @staticmethod
    def match_speakers(segments: List[Dict[str, Any]], diarization_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Matches transcript segments to diarization tracks.
        """
        # Simple overlap-based matching for now
        for seg in segments:
            seg_mid = (seg["start_time"] + seg["end_time"]) / 2
            for track in diarization_results:
                if track["start"] <= seg_mid <= track["end"]:
                    seg["speaker"] = track["speaker"]
                    break
        return segments

diarization_service = DiarizationService()
