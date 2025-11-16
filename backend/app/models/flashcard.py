from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class FlashCard(Base):
    """
    Modèle FlashCard - Table 'flashcards' en DB

    Relations:
        - N FlashCards → 1 User (flashcard.owner)
        - N FlashCards → 1 Category (flashcard.category)
    """
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relations
    owner = relationship("User", back_populates="flashcards")
    category = relationship("Category", back_populates="flashcards")
