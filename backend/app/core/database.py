from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create database engine
# echo=True pour voir les requêtes SQL en dev (utile pour debug)
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,  # Vérifie que la connexion est vivante avant utilisation
)

# Session factory - crée des sessions DB
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class pour tous les modèles SQLAlchemy
Base = declarative_base()


# Dependency pour FastAPI - fournit une session DB par requête
def get_db():
    """
    Crée une nouvelle session DB pour chaque requête HTTP
    La ferme automatiquement après la requête (finally)

    Usage dans FastAPI:
        @app.get("/items")
        def get_items(db: Session = Depends(get_db)):
            return db.query(Item).all()
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
