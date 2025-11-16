from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    """Base category schema"""
    name: str


class CategoryCreate(CategoryBase):
    """
    Schema pour créer une catégorie (POST /api/categories)

    Input: {"name": "Python"}
    """
    pass


class CategoryUpdate(BaseModel):
    """
    Schema pour modifier une catégorie (PUT /api/categories/{id})

    Input: {"name": "Python Advanced"}
    """
    name: str


class CategoryResponse(CategoryBase):
    """
    Schema pour retourner une catégorie

    Output: {
        "id": 1,
        "name": "Python",
        "user_id": 1,
        "created_at": "2024-01-01T00:00:00",
        "flashcard_count": 5
    }
    """
    id: int
    user_id: int
    created_at: datetime
    flashcard_count: Optional[int] = 0  # Nombre de flashcards dans cette catégorie

    class Config:
        from_attributes = True
