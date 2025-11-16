from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user schema avec champs communs"""
    email: EmailStr


class UserCreate(UserBase):
    """
    Schema pour créer un user (POST /auth/register)

    Input: {"email": "user@example.com", "password": "mypassword"}
    """
    password: str


class UserLogin(BaseModel):
    """
    Schema pour login (POST /auth/login)

    Input: {"email": "user@example.com", "password": "mypassword"}
    """
    email: EmailStr
    password: str


class UserResponse(UserBase):
    """
    Schema pour retourner un user (SANS password)

    Output: {"id": 1, "email": "user@example.com", "created_at": "2024-01-01T00:00:00"}
    """
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Permet de créer depuis un model SQLAlchemy


class Token(BaseModel):
    """
    Schema pour retourner un JWT token

    Output: {"access_token": "eyJhbGc...", "token_type": "bearer"}
    """
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema pour les données décodées du token"""
    user_id: Optional[int] = None
