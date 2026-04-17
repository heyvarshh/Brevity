from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Session(Base):
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    source_url = Column(String)
    file_path = Column(String)
    source_type = Column(String) # youtube, upload, meeting
    status = Column(String, default="pending") # pending, processing, completed, failed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    owner_id = Column(Integer, ForeignKey("user.id"))
    owner = relationship("User", backref="sessions")
    
    transcript_chunks = relationship("TranscriptChunk", back_populates="session", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="session", cascade="all, delete-orphan")
    concepts = relationship("Concept", back_populates="session", cascade="all, delete-orphan")
    summaries = relationship("Summary", back_populates="session", cascade="all, delete-orphan")
