from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FlashCardBase(BaseModel):
    """Base flashcard schema"""
    question: str
    answer: str
    category_id: int


class FlashCardCreate(FlashCardBase):
    """
    Schema pour créer une flashcard (POST /api/flashcards)

    Input: {
        "question": "Qu'est-ce que FastAPI ?",
        "answer": "Un framework web moderne pour Python",
        "category_id": 1
    }
    """
    pass


class FlashCardUpdate(BaseModel):
    """
    Schema pour modifier une flashcard (PUT /api/flashcards/{id})

    Input: {
        "question": "Qu'est-ce que FastAPI ?",
        "answer": "Un framework web async pour Python",
        "category_id": 1
    }
    """
    question: Optional[str] = None
    answer: Optional[str] = None
    category_id: Optional[int] = None


class FlashCardResponse(FlashCardBase):
    """
    Schema pour retourner une flashcard

    Output: {
        "id": 1,
        "question": "Qu'est-ce que FastAPI ?",
        "answer": "Un framework web moderne pour Python",
        "category_id": 1,
        "category_name": "Python",
        "user_id": 1,
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }
    """
    id: int
    user_id: int
    category_name: Optional[str] = None  # Nom de la catégorie (join)
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
