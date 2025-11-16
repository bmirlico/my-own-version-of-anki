from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.core.config import settings

# Configuration pour hasher les passwords avec bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifie qu'un password en clair correspond au hash

    Args:
        plain_password: Password tapé par l'user
        hashed_password: Hash stocké en DB

    Returns:
        True si match, False sinon
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash un password avec bcrypt

    Args:
        password: Password en clair

    Returns:
        Hash bcrypt (ex: $2b$12$...)
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crée un JWT access token

    Args:
        data: Données à encoder dans le token (ex: {"sub": user_id})
        expires_delta: Durée de validité (défaut: 24h depuis settings)

    Returns:
        JWT token string (ex: eyJhbGciOiJIUzI1NiIs...)
    """
    to_encode = data.copy()

    # Définir expiration
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    # Encoder avec SECRET_KEY
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[str]:
    """
    Décode un JWT token et retourne le user_id

    Args:
        token: JWT token string

    Returns:
        user_id (str) si token valide, None sinon
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        return user_id
    except JWTError:
        return None
