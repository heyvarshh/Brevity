from app.models.transcript import TranscriptChunk
from app.models.summary import Summary
from app.models.action_item import ActionItem
from app.models.concept import Concept
from app.services.llm import llm_service
from app.services.embeddings import embedding_service
from app.services.vector_db import VectorDB
from app.db.redis import redis_client

@celery_app.task(name="process_video_task", bind=True)
def process_video_task(self, session_id: int):
    db = SessionLocal()
    try:
        # 1. Fetch Session
        session = db.query(Session).filter(Session.id == session_id).first()
        if not session:
            return "Session not found"

        # Update status
        session.status = "downloading"
        db.commit()
        redis_client.publish(f"session_status_{session_id}", json.dumps({"status": "downloading", "progress": 10}))

        # 2. Download Audio
        temp_dir = "/tmp/deepdive"
        os.makedirs(temp_dir, exist_ok=True)
        
        audio_path = downloader_service.get_youtube_audio(session.source_url, temp_dir)
        if not audio_path:
            session.status = "failed"
            db.commit()
            return "Download failed"

        # 3. Transcribe
        session.status = "transcribing"
        db.commit()
        redis_client.publish(f"session_status_{session_id}", json.dumps({"status": "transcribing", "progress": 30}))
        
        raw_transcript = transcription_service.transcribe(audio_path)
        segments = transcription_service.process_segments(raw_transcript)

        # 4. Diarization (Optional based on HF token)
        try:
            diar_results = diarization_service.process(audio_path)
            if diar_results:
                segments = diarization_service.match_speakers(segments, diar_results)
        except Exception as e:
            print(f"Diarization skipped/failed: {e}")

        # 5. Store Chunks
        for idx, seg in enumerate(segments):
            chunk = TranscriptChunk(
                content=seg["content"],
                start_time=seg["start_time"],
                end_time=seg["end_time"],
                speaker=seg["speaker"],
                session_id=session_id
            )
            db.add(chunk)
        
        # 6. Intelligence & Knowledge Extraction
        redis_client.publish(f"session_status_{session_id}", json.dumps({"status": "extracting", "progress": 70}))
        
        full_text = " ".join([seg["content"] for seg in segments])
        
        # a. Multiple Summaries
        for mode in ["quick", "structured", "meeting"]: # Run a few major ones by default
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

        # 7. Indexing for semantic search
        redis_client.publish(f"session_status_{session_id}", json.dumps({"status": "indexing", "progress": 90}))
        
        chunk_texts = [seg["content"] for seg in segments]
        if chunk_texts:
            embeddings = embedding_service.get_embeddings(chunk_texts)
            vdb = VectorDB()
            vdb.add_embeddings(embeddings, [{"session_id": session_id, "text": t, "start": seg["start_time"]} for t, seg in zip(chunk_texts, segments)])
            vdb.save(f"/tmp/deepdive/index_{session_id}")

        # 8. Wrap up
        session.status = "completed"

        # Clean up audio file
        if os.path.exists(audio_path):
            os.remove(audio_path)

        return f"Successfully processed session {session_id}"

    except Exception as e:
        if 'session' in locals() and session:
            session.status = "failed"
            db.commit()
        return f"Error: {str(e)}"
    finally:
        db.close()
