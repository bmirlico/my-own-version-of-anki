from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models import User, Category, FlashCard
from app.schemas import FlashCardCreate, FlashCardUpdate, FlashCardResponse

router = APIRouter(prefix="/flashcards", tags=["FlashCards"])


@router.get("", response_model=List[FlashCardResponse])
def get_flashcards(
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer les flashcards du user (toutes ou par catégorie)

    Query params:
        category_id: (optionnel) ID de la catégorie pour filtrer

    Returns:
        List[FlashCardResponse]: Liste des flashcards avec le nom de catégorie
    """
    query = db.query(FlashCard).filter(FlashCard.user_id == current_user.id)

    # Filter par catégorie si fourni
    if category_id is not None:
        query = query.filter(FlashCard.category_id == category_id)

    flashcards = query.all()

    # Ajouter le nom de la catégorie
    result = []
    for flashcard in flashcards:
        flashcard_dict = {
            "id": flashcard.id,
            "question": flashcard.question,
            "answer": flashcard.answer,
            "category_id": flashcard.category_id,
            "category_name": flashcard.category.name if flashcard.category else None,
            "user_id": flashcard.user_id,
            "created_at": flashcard.created_at,
            "updated_at": flashcard.updated_at
        }
        result.append(flashcard_dict)

    return result


@router.get("/search", response_model=List[FlashCardResponse])
def search_flashcards(
    q: str = Query(..., description="Search keyword"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Rechercher des flashcards par mot-clé (dans question ou answer)

    Query params:
        q: Mot-clé à rechercher

    Returns:
        List[FlashCardResponse]: Flashcards qui matchent
    """
    search_pattern = f"%{q}%"

    flashcards = (
        db.query(FlashCard)
        .filter(FlashCard.user_id == current_user.id)
        .filter(
            (FlashCard.question.ilike(search_pattern)) |
            (FlashCard.answer.ilike(search_pattern))
        )
        .all()
    )

    # Formatter
    result = []
    for flashcard in flashcards:
        flashcard_dict = {
            "id": flashcard.id,
            "question": flashcard.question,
            "answer": flashcard.answer,
            "category_id": flashcard.category_id,
            "category_name": flashcard.category.name if flashcard.category else None,
            "user_id": flashcard.user_id,
            "created_at": flashcard.created_at,
            "updated_at": flashcard.updated_at
        }
        result.append(flashcard_dict)

    return result


@router.post("", response_model=FlashCardResponse, status_code=status.HTTP_201_CREATED)
def create_flashcard(
    flashcard_data: FlashCardCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Créer une nouvelle flashcard

    Args:
        flashcard_data: {
            "question": "Qu'est-ce que FastAPI ?",
            "answer": "Un framework web",
            "category_id": 1
        }

    Returns:
        FlashCardResponse: Flashcard créée

    Raises:
        404: Si catégorie n'existe pas
        403: Si catégorie n'appartient pas au user
    """
    # Vérifier que la catégorie existe et appartient au user
    category = db.query(Category).filter(Category.id == flashcard_data.category_id).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to use this category"
        )

    # Créer la flashcard
    db_flashcard = FlashCard(
        question=flashcard_data.question,
        answer=flashcard_data.answer,
        category_id=flashcard_data.category_id,
        user_id=current_user.id
    )
    db.add(db_flashcard)
    db.commit()
    db.refresh(db_flashcard)

    return {
        "id": db_flashcard.id,
        "question": db_flashcard.question,
        "answer": db_flashcard.answer,
        "category_id": db_flashcard.category_id,
        "category_name": category.name,
        "user_id": db_flashcard.user_id,
        "created_at": db_flashcard.created_at,
        "updated_at": db_flashcard.updated_at
    }


@router.put("/{flashcard_id}", response_model=FlashCardResponse)
def update_flashcard(
    flashcard_id: int,
    flashcard_data: FlashCardUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Modifier une flashcard

    Args:
        flashcard_id: ID de la flashcard
        flashcard_data: Champs à modifier (tous optionnels)

    Returns:
        FlashCardResponse: Flashcard mise à jour

    Raises:
        404: Si flashcard n'existe pas
        403: Si flashcard n'appartient pas au user
    """
    # Trouver la flashcard
    flashcard = db.query(FlashCard).filter(FlashCard.id == flashcard_id).first()

    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FlashCard not found"
        )

    # Vérifier ownership
    if flashcard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this flashcard"
        )

    # Update champs fournis
    if flashcard_data.question is not None:
        flashcard.question = flashcard_data.question

    if flashcard_data.answer is not None:
        flashcard.answer = flashcard_data.answer

    if flashcard_data.category_id is not None:
        # Vérifier que la nouvelle catégorie existe et appartient au user
        category = db.query(Category).filter(Category.id == flashcard_data.category_id).first()

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )

        if category.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to use this category"
            )

        flashcard.category_id = flashcard_data.category_id

    db.commit()
    db.refresh(flashcard)

    return {
        "id": flashcard.id,
        "question": flashcard.question,
        "answer": flashcard.answer,
        "category_id": flashcard.category_id,
        "category_name": flashcard.category.name if flashcard.category else None,
        "user_id": flashcard.user_id,
        "created_at": flashcard.created_at,
        "updated_at": flashcard.updated_at
    }


@router.delete("/{flashcard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_flashcard(
    flashcard_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer une flashcard

    Args:
        flashcard_id: ID de la flashcard

    Raises:
        404: Si flashcard n'existe pas
        403: Si flashcard n'appartient pas au user
    """
    # Trouver la flashcard
    flashcard = db.query(FlashCard).filter(FlashCard.id == flashcard_id).first()

    if not flashcard:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="FlashCard not found"
        )

    # Vérifier ownership
    if flashcard.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this flashcard"
        )

    # Delete
    db.delete(flashcard)
    db.commit()

    return None
