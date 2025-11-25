from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password, create_access_token
from app.api.dependencies import get_current_user
from app.models import User
from app.schemas import UserCreate, UserLogin, UserResponse, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Créer un nouveau compte utilisateur

    Process:
        1. Vérifier que l'email n'existe pas déjà
        2. Hash le password
        3. Créer le user en DB
        4. Retourner le user (sans password)

    Args:
        user_data: {"email": "user@example.com", "password": "mypassword"}

    Returns:
        UserResponse: {"id": 1, "email": "user@example.com", "created_at": "..."}

    Raises:
        400: Si email déjà utilisé
    """
    # Vérifier si email existe déjà
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash le password
    hashed_password = get_password_hash(user_data.password)

    # Créer le user
    db_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Se connecter et obtenir un JWT token

    Process:
        1. Vérifier que l'email existe (username = email pour OAuth2)
        2. Vérifier que le password est correct
        3. Créer un JWT token avec user_id
        4. Retourner le token

    Args:
        form_data: OAuth2 form avec username (=email) et password

    Returns:
        Token: {"access_token": "eyJhbGc...", "token_type": "bearer"}

    Raises:
        401: Si email ou password incorrect
    """
    # OAuth2 utilise "username", on le mappe à "email"
    user = db.query(User).filter(User.email == form_data.username).first()

    # Vérifier user existe et password correct
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Créer JWT token
    access_token = create_access_token(data={"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Récupérer les infos de l'utilisateur connecté

    Headers required:
        Authorization: Bearer <token>

    Returns:
        UserResponse: Info du user connecté
    """
    return current_user

@router.get("/users")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@router.delete("/user/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    to_delete = db.query(User).filter(User.id == user_id).first()

    if not to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    db.delete(to_delete)
    db.commit()