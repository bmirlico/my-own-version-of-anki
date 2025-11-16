from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import auth, categories, flashcards

# Créer les tables en DB (alternative à Alembic pour dev)
Base.metadata.create_all(bind=engine)

# Initialiser FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,  # Frontend dev (localhost:5173)
        "http://localhost:3000",  # Alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Authorization, Content-Type, etc.
)

# Inclure les routes
app.include_router(auth.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(flashcards.router, prefix="/api")


@app.get("/")
def root():
    """
    Root endpoint pour vérifier que l'API est en ligne
    """
    return {
        "message": "Flashcards API is running",
        "version": settings.VERSION,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint pour Docker/monitoring
    """
    return {"status": "healthy"}
