from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import User

# OAuth2 scheme - extrait le token du header "Authorization: Bearer <token>"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Dependency pour récupérer l'utilisateur courant depuis le JWT token

    Usage dans un endpoint:
        @app.get("/protected")
        def protected_route(current_user: User = Depends(get_current_user)):
            return {"user_id": current_user.id}

    Process:
        1. Extrait le token du header Authorization
        2. Décode le token JWT
        3. Récupère user_id depuis le token
        4. Query la DB pour trouver le user
        5. Retourne le user ou erreur 401

    Raises:
        HTTPException 401: Si token invalide ou user n'existe pas
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Décoder le token
    user_id = decode_access_token(token)
    if user_id is None:
        raise credentials_exception

    # Récupérer le user depuis la DB
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    return user
