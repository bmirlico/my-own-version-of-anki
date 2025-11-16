from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class Category(Base):
    """
    Modèle Category - Table 'categories' en DB

    Relations:
        - N Categories → 1 User (category.owner)
        - 1 Category → N FlashCards (category.flashcards)
    """
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relations
    owner = relationship("User", back_populates="categories")
    flashcards = relationship("FlashCard", back_populates="category", cascade="all, delete-orphan")
