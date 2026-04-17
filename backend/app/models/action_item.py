from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ActionItem(Base):
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    type = Column(String) # task, follow-up, decision, question
    timestamp = Column(Float)
    assignee = Column(String)
    status = Column(String, default="pending")
    
    session_id = Column(Integer, ForeignKey("session.id"))
    session = relationship("Session", back_populates="action_items")
