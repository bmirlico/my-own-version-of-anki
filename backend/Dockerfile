# Étape 1 : Partir d'une image Python officielle (version slim = légère)
FROM python:3.11-slim

# Étape 2 : Définir le dossier de travail dans le container
# Tous les fichiers seront copiés ici
WORKDIR /app

# Étape 3 : Copier UNIQUEMENT requirements.txt en premier
# Pourquoi ? Docker met en cache cette étape si requirements.txt ne change pas
# = Plus rapide lors des rebuilds
COPY requirements.txt .

# Étape 4 : Installer les dépendances Python
# --no-cache-dir = Ne pas garder le cache pip (économise de l'espace)
RUN pip install --no-cache-dir -r requirements.txt

# Étape 5 : Copier tout le code source de l'application
# "." à gauche = dossier backend/ sur votre machine
# "." à droite = /app dans le container
COPY . .

# Étape 6 : Exposer le port 8000
# FastAPI/uvicorn écoute sur ce port
# C'est juste de la documentation, le port n'est pas vraiment ouvert
EXPOSE 8000

# Étape 7 : Commande exécutée au démarrage du container
# uvicorn = serveur ASGI qui lance FastAPI
# app.main:app = fichier app/main.py, variable "app"
# --host 0.0.0.0 = Écouter sur toutes les interfaces (pas juste localhost)
# --port 8000 = Port d'écoute
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
