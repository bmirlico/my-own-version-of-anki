from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.api.dependencies import get_current_user
from app.models import User, Category, FlashCard
from app.schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("", response_model=List[CategoryResponse])
def get_categories(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Récupérer toutes les catégories du user connecté

    Returns:
        List[CategoryResponse]: Liste des catégories avec le nombre de flashcards
    """
    # Query avec count des flashcards par catégorie
    categories = (
        db.query(
            Category,
            func.count(FlashCard.id).label("flashcard_count")
        )
        .outerjoin(FlashCard, Category.id == FlashCard.category_id)
        .filter(Category.user_id == current_user.id)
        .group_by(Category.id)
        .all()
    )

    # Formatter la réponse
    result = []
    for category, count in categories:
        category_dict = {
            "id": category.id,
            "name": category.name,
            "user_id": category.user_id,
            "created_at": category.created_at,
            "flashcard_count": count
        }
        result.append(category_dict)

    return result


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Créer une nouvelle catégorie

    Args:
        category_data: {"name": "Python"}

    Returns:
        CategoryResponse: Catégorie créée
    """
    # Créer la catégorie
    db_category = Category(
        name=category_data.name,
        user_id=current_user.id
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    # Retourner avec flashcard_count = 0
    return {
        "id": db_category.id,
        "name": db_category.name,
        "user_id": db_category.user_id,
        "created_at": db_category.created_at,
        "flashcard_count": 0
    }


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Modifier une catégorie

    Args:
        category_id: ID de la catégorie
        category_data: {"name": "Python Advanced"}

    Returns:
        CategoryResponse: Catégorie mise à jour

    Raises:
        404: Si catégorie n'existe pas
        403: Si catégorie n'appartient pas au user
    """
    # Trouver la catégorie
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # Vérifier ownership
    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this category"
        )

    # Update
    category.name = category_data.name
    db.commit()
    db.refresh(category)

    # Count flashcards
    flashcard_count = db.query(FlashCard).filter(FlashCard.category_id == category_id).count()

    return {
        "id": category.id,
        "name": category.name,
        "user_id": category.user_id,
        "created_at": category.created_at,
        "flashcard_count": flashcard_count
    }


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Supprimer une catégorie (cascade delete les flashcards)

    Args:
        category_id: ID de la catégorie

    Raises:
        404: Si catégorie n'existe pas
        403: Si catégorie n'appartient pas au user
    """
    # Trouver la catégorie
    category = db.query(Category).filter(Category.id == category_id).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )

    # Vérifier ownership
    if category.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this category"
        )

    # Delete (cascade supprime les flashcards)
    db.delete(category)
    db.commit()

    return None
