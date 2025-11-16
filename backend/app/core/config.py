from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables

    Peut charger depuis:
    - Fichier .env (dev local)
    - Variables d'environnement Docker (docker-compose)
    """
    # Database
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str = "localhost"  # "localhost" en dev local, "postgres" dans Docker
    POSTGRES_PORT: int = 5432

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # JWT Security
    SECRET_KEY: str  # Generate with: openssl rand -hex 32
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # CORS
    FRONTEND_URL: str = "http://localhost:5173"  # Vite dev server

    # App
    PROJECT_NAME: str = "Flashcards API"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
