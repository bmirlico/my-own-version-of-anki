# My Own Version of Anki - Flashcards Web App

Une application web de flashcards pour l'apprentissage et la mémorisation, inspirée d'Anki.

## Stack Technique

### Backend
- **Framework** : FastAPI + Pydantic
- **Database** : PostgreSQL (Dockerized)
- **Auth** : JWT tokens (24h expiration)
- **ORM** : SQLAlchemy
- **Password Hashing** : Bcrypt

### Frontend (Approche Progressive)

**Phase 1 - Fondamentaux** (Démarrage) :
- **Framework** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Routing** : React Router v6
- **HTTP Client** : Axios
- **UI State Management** : Zustand (auth, modals, UI state)
- **Data Fetching** : useState + useEffect + Axios (manuel, pas de TanStack Query)

**Pourquoi cette approche ?**
- **Zustand** : Gérer proprement l'état UI (auth, modals) sans complexité de Redux
- **Data fetching manuel** : Comprendre les concepts fondamentaux (loading, error, data states)
- Gérer manuellement les side effects avec useEffect
- Voir concrètement les problèmes (race conditions, stale data, cache)
- Apprentissage en profondeur pour améliorer les compétences en CS

**Séparation claire** :
- Zustand → UI state (authentification, modals ouvertes/fermées, etc.)
- useState/useEffect → Server state (flashcards, catégories depuis l'API)

**Phase 2 - Optimisation** (Après 2-3 semaines) :
- **Migration vers TanStack Query** pour le data fetching uniquement
- Refactoring progressif du code manuel vers TanStack Query
- Appréciation des avantages (cache intelligent, refetch automatique, optimistic updates)
- **Zustand reste** pour l'UI state

**TanStack Router** : Non utilisé (overkill pour 3-4 routes simples)

### Déploiement
- **Containerization** : Docker + Docker Compose
- **VPS** : Hostinger
- **Reverse Proxy** : Nginx (production uniquement)
- **SSL** : Let's Encrypt
- **CI/CD** : GitHub Actions (Phase 2)

---

## 🎯 PHASE 1 : SETUP & ARCHITECTURE DU PROJET

### Étape 1.1 : Initialiser la structure du projet
**Objectif** : Créer l'arborescence complète du monorepo

**Structure** :
```
flashcards-app/
├── backend/
│   ├── app/
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── api/          # Routes/endpoints
│   │   ├── core/         # Config, security, DB
│   │   └── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/     # API calls
│   │   ├── store/        # Zustand state
│   │   └── App.jsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .gitignore
└── README.md
```

**Assumptions** : Monorepo pour simplifier le développement et déploiement

---

## 🗄️ PHASE 2 : BASE DE DONNÉES & MODÈLES

### Étape 2.1 : Modèle de données PostgreSQL
**Objectif** : Définir le schéma DB avec relations

**Schéma** :
- **users** : id, email, hashed_password, created_at
- **categories** : id, name, user_id (FK), created_at
- **flashcards** : id, question, answer, category_id (FK), user_id (FK), created_at, updated_at

**Relations** :
- User → Categories (1:N)
- User → FlashCards (1:N)
- Category → FlashCards (1:N)

**Assumptions** : Chaque user a ses propres catégories et flashcards (isolation complète)

### Étape 2.2 : SQLAlchemy Models
**Implémentation** : Classes avec relationships et back_populates pour navigation bidirectionnelle

**Indexes** : user_id sur tables categories et flashcards pour requêtes rapides

---

## 🔐 PHASE 3 : BACKEND - AUTHENTIFICATION

### Étape 3.1 : JWT Authentication System
**Objectif** : Sécuriser l'API avec tokens JWT

**Approche** :
- **Register** : Hash password (bcrypt), créer user, retourner user info
- **Login** : Vérifier credentials, générer JWT access token (expiration 24h)
- **Token format** : `{"sub": user_id, "exp": timestamp}`

**Dépendances** :
```python
get_current_user(token: str = Depends(oauth2_scheme))
# Decode JWT → récupérer user_id → fetch user DB
```

**Assumptions** : Pas de refresh token pour MVP, access token 24h suffisant

### Étape 3.2 : Security & Validation
- Validation email format (Pydantic)
- Password min 8 caractères
- HTTP-only cookies possible (alternative à Bearer token)

---

## 🚀 PHASE 4 : BACKEND - API ENDPOINTS

### Étape 4.1 : Categories Endpoints

**GET /api/categories**
- Retourner toutes les catégories du user connecté
- Filter : `WHERE user_id = current_user.id`
- Response : `[{id, name, flashcard_count}]`

**POST /api/categories**
- Body : `{name: str}`
- Validation : name unique par user
- Créer category liée au current_user

**PUT /api/categories/{id}**
- Vérifier ownership : `category.user_id == current_user.id`
- Update name

**DELETE /api/categories/{id}**
- Cascade delete flashcards ou error si catégorie non vide
- **Assumption** : Cascade delete pour simplifier

### Étape 4.2 : FlashCards Endpoints

**GET /api/flashcards**
- Query params : `?category_id=X` (optionnel)
- Filter par user_id + category_id si fourni
- Response : `[{id, question, answer, category_id, category_name}]`

**GET /api/flashcards/search?q=keyword**
- Full-text search sur question + answer
- PostgreSQL : `WHERE (question ILIKE '%keyword%' OR answer ILIKE '%keyword%') AND user_id = X`

**POST /api/flashcards**
- Body : `{question, answer, category_id}`
- Vérifier que category appartient au user

**PUT /api/flashcards/{id}**
- Ownership check
- Update question, answer, category_id

**DELETE /api/flashcards/{id}**
- Ownership check + hard delete

**Assumptions** : Pas de soft delete, recherche simple avec ILIKE (pas Elasticsearch)

### Étape 4.3 : Error Handling & CORS
- Custom exception handlers (401, 403, 404, 422)
- CORS : autoriser origin du frontend (localhost:5173 en dev, domaine prod)

---

## 🎨 PHASE 5 : FRONTEND - ARCHITECTURE REACT

### Étape 5.1 : Setup Vite + Dependencies
**Stack** :
- React 18 + Vite
- React Router v6 (routing)
- Axios (HTTP client)
- Zustand (state management léger)
- TailwindCSS ou CSS modules (styling)

**Assumptions** : Zustand plus simple que Redux pour ce scope

### Étape 5.2 : State Management (Zustand)

**Auth Store** :
```javascript
{
  user: {id, email},
  token: string,
  login(email, password),
  logout(),
  isAuthenticated: boolean
}
```

**FlashCards Store** :
```javascript
{
  flashcards: [],
  categories: [],
  fetchFlashcards(categoryId?),
  createFlashcard(data),
  updateFlashcard(id, data),
  deleteFlashcard(id),
  searchFlashcards(query)
}
```

**Assumptions** : Token stocké en localStorage (alternative : sessionStorage)

### Étape 5.3 : Axios Configuration
- Base URL : `http://localhost:8000/api` (dev), variable env (prod)
- Interceptor request : ajouter `Authorization: Bearer ${token}`
- Interceptor response : redirect vers /login si 401

---

## 🖥️ PHASE 6 : FRONTEND - COMPOSANTS & PAGES

### Étape 6.1 : Authentication Pages

**Login Page** :
- Form : email + password
- Submit → call API → store token + user → redirect /dashboard

**Register Page** :
- Form : email + password + confirm password
- Validation côté client avant submit

**Protected Route Component** :
- HOC qui check `isAuthenticated`
- Redirect vers /login si non auth

### Étape 6.2 : Dashboard & Navigation

**Dashboard** :
- Navbar : logo, search bar, logout button
- Sidebar : "All Cards", liste des catégories
- Main : grid de flashcards

**Assumptions** : Layout avec sidebar fixe, content scrollable

### Étape 6.3 : FlashCard Component (Flip Animation)

**Approche CSS** :
```css
.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card.flipped {
  transform: rotateY(180deg);
}
.card-front, .card-back {
  backface-visibility: hidden;
}
```

**State** : `const [isFlipped, setIsFlipped] = useState(false)`

**Interaction** :
- Click ou button "Show Answer" → toggle flip
- Front : affiche question
- Back : affiche réponse + boutons edit/delete

### Étape 6.4 : CRUD Forms

**Create/Edit FlashCard Modal** :
- Form : question (textarea), answer (textarea), category (select)
- Mode create vs edit (même composant)
- Validation : champs required

**Category Management** :
- Modal pour créer catégorie
- Edit inline dans sidebar (double-click)
- Confirm dialog pour delete

### Étape 6.5 : Search & Filters

**Search Bar** :
- Debounce 300ms avant API call
- Real-time results

**Category Filter** :
- Click catégorie → fetch flashcards de cette catégorie
- "All Cards" → fetch toutes

---

## 🐳 PHASE 7 : DOCKERISATION

### Étape 7.1 : Docker Compose PostgreSQL
```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: flashcards_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
```

**Assumptions** : PostgreSQL 15 pour performance, Alpine pour image légère

### Étape 7.2 : Backend Dockerfile
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Migrations** : Alembic pour gérer schéma DB (init, upgrade)

### Étape 7.3 : Frontend Dockerfile (Multi-stage)
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

**Nginx config** : Proxy /api vers backend, serve static pour le reste

### Étape 7.4 : Docker Compose complet
- Network bridge pour communication inter-containers
- Health checks pour postgres avant start backend
- Environment variables via .env file

---

## 🌐 PHASE 8 : DÉPLOIEMENT VPS

### Étape 8.1 : Préparation VPS Hostinger
1. SSH access
2. Installer Docker + Docker Compose
3. Firewall : `ufw allow 22,80,443/tcp`

### Étape 8.2 : SSL avec Let's Encrypt
- Certbot pour obtenir certificats
- Auto-renewal avec cron job
- Nginx comme reverse proxy HTTPS

### Étape 8.3 : Variables d'environnement Production
```
DATABASE_URL=postgresql://user:pass@postgres:5432/db
SECRET_KEY=<générer clé 32 bytes>
FRONTEND_URL=https://votredomaine.com
```

### Étape 8.4 : Déploiement
```bash
git clone repo
docker-compose -f docker-compose.prod.yml up -d
docker-compose exec backend alembic upgrade head
```

**Assumptions** : Git pour déploiement (alternative : CI/CD GitHub Actions)

---

## 🔄 PHASE 9 : CI/CD

### Workflow Recommandé

**Phase 1** : Déploiement manuel pour apprendre
**Phase 2** : GitHub Actions basique quand stable
**Phase 3** : CI/CD avec tests pour production

### Option 1 : Déploiement Manuel Simple

```bash
# Sur le VPS
ssh user@votre-vps.com
cd /var/www/flashcards-app
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Option 2 : GitHub Actions Automatique

**Setup VPS** :
```bash
# Créer user deploy
sudo adduser deploy
sudo usermod -aG docker deploy
ssh-keygen -t ed25519 -C "github-actions"
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
```

**Secrets GitHub** :
- `VPS_HOST` : IP ou domaine du VPS
- `VPS_USER` : deploy
- `VPS_SSH_KEY` : clé privée
- `POSTGRES_PASSWORD` : password DB
- `JWT_SECRET_KEY` : clé secrète

**Fichier `.github/workflows/deploy.yml`** :
```yaml
name: Deploy to VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.VPS_SSH_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H ${{ secrets.VPS_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to VPS
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
        run: |
          ssh $VPS_USER@$VPS_HOST << 'EOF'
            cd /var/www/flashcards-app
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose exec -T backend alembic upgrade head
          EOF
```

---

## 📋 API Endpoints - Résumé

### Authentication
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter

### Categories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie
- `PUT /api/categories/{id}` - Modifier une catégorie
- `DELETE /api/categories/{id}` - Supprimer une catégorie

### FlashCards
- `GET /api/flashcards` - Toutes les cartes
- `GET /api/flashcards?category_id=X` - Cartes par catégorie
- `GET /api/flashcards/search?q=keyword` - Rechercher des cartes
- `POST /api/flashcards` - Créer une carte
- `PUT /api/flashcards/{id}` - Modifier une carte
- `DELETE /api/flashcards/{id}` - Supprimer une carte

---

## 🚀 Workflow de Développement

### En local (sans reverse proxy)
```bash
# Terminal 1 : Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
# → http://localhost:8000

# Terminal 2 : Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173

# Terminal 3 : PostgreSQL (Docker)
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=flashcards_db \
  -e POSTGRES_PASSWORD=dev \
  postgres:15-alpine
```

### En production (avec reverse proxy)
```bash
# Sur VPS
cd /var/www/flashcards-app
docker-compose up -d
# → Nginx route tout via https://flashcards.com
```

---

## 📝 Notes Importantes

### Sécurité
- Jamais commit les secrets (.env dans .gitignore)
- Passwords hashés avec bcrypt
- JWT tokens avec expiration
- Validation stricte des inputs (Pydantic)
- HTTPS obligatoire en production

### Performance
- Indexes sur user_id pour requêtes rapides
- Connection pooling PostgreSQL
- Cache statique via Nginx
- Images Docker Alpine (légères)

### Développement
- CORS configuré pour localhost:5173 en dev
- Hot reload backend et frontend
- Logs séparés pour debug facile
- Alembic pour migrations DB versionnées

---

## 📚 Ressources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React + Vite](https://vitejs.dev/guide/)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Docker Compose](https://docs.docker.com/compose/)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 🎯 Prochaines Étapes

1. Créer la structure backend/frontend
2. Setup PostgreSQL avec Docker
3. Implémenter authentification JWT
4. Créer les endpoints API
5. Développer les composants React
6. Dockeriser l'application
7. Déployer sur VPS
8. Configurer CI/CD

# Questions
- class Config: from_attributes: true ?
- implement later httonly cookie in front and back for secure auth: https://fastapitutorial.medium.com/fastapi-securing-jwt-token-with-httponly-cookie-47e0139b8dde
- hot reload dans un container fonctionne ?
- postico dl via brew ou en ligne ?
- ps aux ?
- docker ps
- quand dois je rebuild l'image docker ? dans le cas où j'ajoute une lib dans requirement.txt
- pourquoi mettre des _init__py dans les packages / folders python ?


# References
- https://www.freecodecamp.org/news/deploy-fastapi-postgresql-app-on-render/
- https://www.freecodecamp.org/news/how-to-add-jwt-authentication-in-fastapi/

