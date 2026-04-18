import json
import os
import asyncio
from app.models.transcript import TranscriptChunk
from app.models.summary import Summary
from app.models.action_item import ActionItem
from app.models.concept import Concept
from app.models.session import Session
from app.services.llm import llm_service
from app.services.transcription import transcription_service
from app.services.diarization import diarization_service
from app.services.embeddings import embedding_service
from app.services.vector_db import vector_db
from app.services.downloader import downloader_service
from app.db.session import SessionLocal
from app.core.sockets import manager

async def process_video_async(session_id: int):
    """
    Lightweight background processor for Render Free Tier.
    Does not require Celery or Redis.
    """
    db = SessionLocal()
    try:
        # 1. Fetch Session
        session = db.query(Session).filter(Session.id == session_id).first()
        if not session:
            return "Session not found"

        # Update status
        session.status = "downloading"
        db.commit()
        await manager.broadcast(session_id, {"status": "downloading", "progress": 10})

        # 2. Download Audio
        temp_dir = "/tmp/deepdive"
        os.makedirs(temp_dir, exist_ok=True)
        
        audio_path = downloader_service.get_youtube_audio(session.source_url, temp_dir)
        if not audio_path:
            session.status = "failed"
            db.commit()
            await manager.broadcast(session_id, {"status": "failed", "error": "Download failed"})
            return "Download failed"

        # 3. Transcribe
        session.status = "transcribing"
        db.commit()
        await manager.broadcast(session_id, {"status": "transcribing", "progress": 30})
        
        # Groq is ultra-fast, so we call it here
        raw_transcript = transcription_service.transcribe(audio_path)
        segments = transcription_service.process_segments(raw_transcript)

        # 4. Store Chunks
        for seg in segments:
            chunk = TranscriptChunk(
                content=seg["content"],
                start_time=seg["start_time"],
                end_time=seg["end_time"],
                speaker=seg["speaker"],
                session_id=session_id
            )
            db.add(chunk)
        
        # 5. Intelligence & Knowledge Extraction
        await manager.broadcast(session_id, {"status": "extracting", "progress": 70})
        
        full_text = " ".join([seg["content"] for seg in segments])
        
        # a. Multiple Summaries
        for mode in ["quick", "structured", "meeting"]:
            content = llm_service.summarize(full_text, mode)
            summary = Summary(mode=mode, content=content, session_id=session_id)
            db.add(summary)
            
        # b. Action Items & Concepts
        intel = llm_service.extract_intelligence(full_text)
        for item in intel.get("action_items", []):
            action = ActionItem(
                content=item["content"],
                type=item["type"],
                assignee=item.get("assignee"),
                session_id=session_id
            )
            db.add(action)
            
        for con in intel.get("concepts", []):
            concept = Concept(
                name=con["name"],
                description=con.get("description"),
                session_id=session_id
            )
            db.add(concept)

        # 6. Indexing for semantic search (Lightweight)
        await manager.broadcast(session_id, {"status": "indexing", "progress": 90})
        
        chunk_texts = [seg["content"] for seg in segments]
        if chunk_texts:
            # Note: We'll use a simpler embedding or just skip if no key
            embeddings = embedding_service.get_embeddings(chunk_texts)
            if embeddings:
                vector_db.add_embeddings(embeddings, [{"session_id": session_id, "text": t, "start": seg["start_time"]} for t, seg in zip(chunk_texts, segments)])

        # 7. Wrap up
        session.status = "completed"
        db.commit()
        await manager.broadcast(session_id, {"status": "completed", "progress": 100})

        # Clean up audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)

        return f"Successfully processed session {session_id}"

    except Exception as e:
        print(f"Error processing session {session_id}: {e}")
        if 'session' in locals() and session:
            session.status = "failed"
            db.commit()
            await manager.broadcast(session_id, {"status": "failed", "error": str(e)})
        return f"Error: {str(e)}"
    finally:
        db.close()
