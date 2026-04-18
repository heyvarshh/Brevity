from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Any, List
from app.db.session import SessionLocal
from app.models.session import Session as SessionModel
from app.worker.tasks import process_video_async

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/process")
async def process_video(
    *,
    db: Session = Depends(get_db),
    url: str,
    title: str = "New Analysis",
    background_tasks: BackgroundTasks
) -> Any:
    """
    Creates a session and triggers background processing.
    """
    # 1. Create session record
    session = SessionModel(
        title=title,
        source_url=url,
        source_type="youtube",
        status="pending"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    
    # 2. Trigger background task
    background_tasks.add_task(process_video_async, session.id)
    
    return session

@router.get("/{session_id}")
async def get_session(
    session_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """
    Gets full session data.
    """
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return {
        "id": session.id,
        "title": session.title,
        "status": session.status,
        "source_url": session.source_url,
        "transcript": session.transcript_chunks,
        "summaries": {s.mode: s.content for s in session.summaries},
        "action_items": session.action_items,
        "concepts": session.concepts
    }
