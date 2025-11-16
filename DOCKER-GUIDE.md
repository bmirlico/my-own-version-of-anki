# 🐳 Guide Docker - Flashcards App

Ce guide explique comment lancer l'application avec Docker.

---

## 📁 Structure des fichiers

```
my-own-version-of-anki/
├── .env                    # Variables d'environnement (SECRETS - pas sur Git)
├── .env.example            # Template des variables (sur Git)
├── .gitignore              # Fichiers à ignorer par Git
├── docker-compose.yml      # Orchestration des containers
├── backend/
│   ├── Dockerfile          # Recette pour containeriser FastAPI
│   ├── app/                # Code source
│   └── requirements.txt    # Dépendances Python
└── README.md
```

---

## 🚀 Démarrage Rapide

### 1. Vérifier que Docker est installé

```bash
docker --version
docker-compose --version
```

Si pas installé : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop)

---

### 2. Configurer les variables d'environnement

Le fichier `.env` contient déjà des valeurs par défaut. **Optionnel** : Générer une nouvelle SECRET_KEY :

```bash
# Générer une nouvelle clé secrète
openssl rand -hex 32

# Éditer .env et remplacer SECRET_KEY
nano .env
```

---

### 3. Lancer l'application

```bash
# À la racine du projet (là où se trouve docker-compose.yml)
docker-compose up
```

**Ce qui se passe** :
1. Docker télécharge l'image PostgreSQL (première fois seulement)
2. Docker build l'image du backend depuis le Dockerfile
3. Démarre le container PostgreSQL
4. Attend que PostgreSQL soit "healthy" (health check)
5. Démarre le container backend
6. Les tables sont créées automatiquement dans PostgreSQL

**Logs affichés** :
```
flashcards-postgres | database system is ready to accept connections
flashcards-backend  | INFO:     Uvicorn running on http://0.0.0.0:8000
flashcards-backend  | INFO:     Application startup complete.
```

---

### 4. Accéder à l'application

- **API** : http://localhost:8000
- **Swagger Docs** : http://localhost:8000/docs
- **PostgreSQL** : localhost:5432 (user: postgres, password: dev123)

---

## 🛠️ Commandes Utiles

### Lancer en arrière-plan (mode détaché)

```bash
docker-compose up -d
```

### Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Seulement le backend
docker-compose logs -f backend

# Seulement postgres
docker-compose logs -f postgres
```

### Arrêter les containers

```bash
# Arrêter sans supprimer
docker-compose stop

# Arrêter et supprimer les containers
docker-compose down
```

### Supprimer tout (containers + volumes)

```bash
# ATTENTION : Supprime aussi les données PostgreSQL !
docker-compose down -v
```

### Rebuild après modification du code

```bash
# Rebuild l'image backend et redémarre
docker-compose up --build
```

### Accéder au shell d'un container

```bash
# Backend (Python)
docker exec -it flashcards-backend bash

# PostgreSQL
docker exec -it flashcards-postgres psql -U postgres -d flashcards_db
```

---

## 🔍 Comment ça fonctionne ?

### Flow des variables d'environnement

```
1. Vous éditez .env :
   POSTGRES_PASSWORD=dev123
   SECRET_KEY=abc...

2. docker-compose.yml lit le .env :
   environment:
     POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
     SECRET_KEY: ${SECRET_KEY}

3. Variables injectées dans les containers :
   - Container postgres reçoit POSTGRES_PASSWORD
   - Container backend reçoit toutes les variables

4. backend/app/core/config.py lit ces variables :
   class Settings(BaseSettings):
       POSTGRES_PASSWORD: str  # ← Pydantic lit depuis l'env
```

---

### Communication entre containers

```
┌─────────────────────────────────────────┐
│  Réseau Docker (créé automatiquement)   │
│                                          │
│  ┌──────────────┐    ┌───────────────┐ │
│  │  postgres    │◄───┤   backend     │ │
│  │  (DB)        │    │   (FastAPI)   │ │
│  │              │    │               │ │
│  │ Port 5432    │    │ Port 8000     │ │
│  └──────┬───────┘    └───────┬───────┘ │
│         │                    │          │
└─────────┼────────────────────┼──────────┘
          │                    │
          ▼                    ▼
    localhost:5432      localhost:8000
   (votre machine)     (votre machine)
```

**IMPORTANT** :
- Le backend se connecte à `postgres:5432` (nom du service)
- Vous vous connectez à `localhost:5432` (port mappé)

---

## 🧪 Tester l'API avec Docker

### 1. Créer un compte

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Réponse** :
```json
{
  "id": 1,
  "email": "test@example.com",
  "created_at": "2024-01-15T10:00:00"
}
```

### 2. Se connecter

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Réponse** :
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### 3. Créer une catégorie (avec token)

```bash
TOKEN="votre_token_ici"

curl -X POST http://localhost:8000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Python"}'
```

---

## 📊 Volumes Docker

### Volume PostgreSQL

Les données PostgreSQL sont stockées dans un **volume Docker nommé** : `postgres_data`

**Avantages** :
- Les données survivent à `docker-compose down`
- Partagées entre rebuilds

**Voir les volumes** :
```bash
docker volume ls
```

**Supprimer le volume** (⚠️ perte de données) :
```bash
docker-compose down -v
```

### Bind Mount Backend

Le dossier `./backend` est **monté** dans le container à `/app`

**Avantages** :
- Hot reload : modifiez un fichier Python, uvicorn redémarre automatiquement
- Pas besoin de rebuild pour tester des changements

---

## 🐛 Troubleshooting

### Erreur : "port 5432 already in use"

Un autre PostgreSQL tourne sur votre machine.

**Solution** :
```bash
# Arrêter PostgreSQL local
brew services stop postgresql
# Ou changer le port dans docker-compose.yml : "5433:5432"
```

### Erreur : "SECRET_KEY required"

Le fichier `.env` n'existe pas ou est mal configuré.

**Solution** :
```bash
cp .env.example .env
openssl rand -hex 32  # Générer une clé
nano .env             # Coller la clé
```

### Backend ne démarre pas : "could not connect to postgres"

Le health check échoue ou le backend démarre trop vite.

**Solution** :
```bash
# Voir les logs postgres
docker-compose logs postgres

# Redémarrer
docker-compose restart backend
```

### Hot reload ne fonctionne pas

Le volume n'est pas monté correctement.

**Solution** :
```bash
# Vérifier les volumes montés
docker inspect flashcards-backend | grep Mounts -A 10

# Rebuild
docker-compose down && docker-compose up --build
```

---

## 🔄 Workflow de Développement

### Modifier du code Python

1. Éditez un fichier dans `backend/app/`
2. Uvicorn détecte le changement (grâce au bind mount)
3. Redémarre automatiquement (`--reload`)
4. Testez immédiatement sur http://localhost:8000

**Aucun rebuild nécessaire !**

### Ajouter une dépendance Python

1. Ajoutez dans `backend/requirements.txt`
2. Rebuild l'image :
   ```bash
   docker-compose up --build backend
   ```

### Modifier docker-compose.yml ou Dockerfile

```bash
# Rebuild complet
docker-compose down
docker-compose up --build
```

---

## 🎯 Prochaines Étapes

1. ✅ Backend dockerisé et fonctionnel
2. ⏳ Créer le frontend React + Vite
3. ⏳ Ajouter le frontend dans docker-compose.yml
4. ⏳ Déployer sur VPS avec CI/CD

---

## 📚 Ressources

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [FastAPI + Docker](https://fastapi.tiangolo.com/deployment/docker/)
