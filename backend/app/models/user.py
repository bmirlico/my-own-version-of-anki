from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base


class User(Base):
    """
    Modèle User - Table 'users' en DB

    Relations:
        - 1 User → N Categories (user.categories)
        - 1 User → N FlashCards (user.flashcards)
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relations
    categories = relationship("Category", back_populates="owner", cascade="all, delete-orphan")
    flashcards = relationship("FlashCard", back_populates="owner", cascade="all, delete-orphan")
