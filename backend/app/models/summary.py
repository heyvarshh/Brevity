from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Summary(Base):
    id = Column(Integer, primary_key=True, index=True)
    mode = Column(String) # quick, structured, exam, meeting, eli5, executive
    content = Column(Text, nullable=False)
    
    session_id = Column(Integer, ForeignKey("session.id"))
    session = relationship("Session", back_populates="summaries")
