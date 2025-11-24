import axios from 'axios'

/**
 * Axios instance configurée pour communiquer avec l'API backend
 *
 * Base URL:
 * - Dev: http://localhost:8000/api (backend FastAPI)
 * - Prod: À définir lors du déploiement
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000, // 10 secondes max par requête
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request Interceptor
 *
 * S'exécute AVANT chaque requête envoyée au backend
 * Ajoute automatiquement le token JWT dans le header Authorization
 */
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem('token')

    // Si un token existe, l'ajouter au header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Erreur avant d'envoyer la requête (rare)
    return Promise.reject(error)
  }
)

/**
 * Response Interceptor
 *
 * S'exécute APRÈS chaque réponse reçue du backend
 * Gère les erreurs communes (401, 403, etc.)
 */
api.interceptors.response.use(
  (response) => {
    // Si la réponse est OK (200-299), on la retourne directement
    return response
  },
  (error) => {
    // Gérer les erreurs HTTP
    if (error.response) {
      // Le backend a répondu avec un code d'erreur
      const status = error.response.status

      if (status === 401) {
        // Non authentifié : supprimer le token et rediriger vers login
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        // Rediriger vers /login (sauf si on est déjà sur /login)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        // Interdit : l'utilisateur n'a pas les permissions
        console.error('Access forbidden')
      } else if (status === 404) {
        // Ressource non trouvée
        console.error('Resource not found')
      } else if (status >= 500) {
        // Erreur serveur
        console.error('Server error')
      }
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse
      console.error('No response from server')
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Request configuration error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
