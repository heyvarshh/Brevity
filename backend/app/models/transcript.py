from sqlalchemy import Column, Integer, String, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class TranscriptChunk(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    speaker = Column(String)
    
    session_id = Column(Integer, ForeignKey("session.id"))
    session = relationship("Session", back_populates="transcript_chunks")
