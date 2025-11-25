import { create } from 'zustand'
import api from '../services/api'
import type { User, Token, UserLogin, UserCreate } from '../types'

/**
 * Auth Store - Gestion de l'authentification avec Zustand
 *
 * Ce store gère :
 * - L'utilisateur connecté (user)
 * - Le token JWT (token)
 * - Les actions de login, register, logout
 */

interface AuthStore {
  // État
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Actions
  login: (credentials: UserLogin) => Promise<void>
  register: (userData: UserCreate) => Promise<void>
  logout: () => void
  initializeAuth: () => void
}

/**
 * Hook useAuthStore
 *
 * Utilisation dans un composant :
 * const { user, login, logout } = useAuthStore()
 */
export const useAuthStore = create<AuthStore>((set) => ({
  // État initial
  user: null,
  token: null,
  isAuthenticated: false,

  /**
   * Login - Authentifier un utilisateur
   *
   * 1. Envoie username (=email) + password au backend en form-data
   * 2. Reçoit un token JWT
   * 3. Récupère les infos utilisateur
   * 4. Stocke token + user dans localStorage ET dans le store
   */
  login: async (credentials: UserLogin) => {
    try {
      // Étape 1 : Créer FormData pour OAuth2 (username = email)
      const formData = new FormData()
      formData.append('username', credentials.email) // OAuth2 utilise "username"
      formData.append('password', credentials.password)

      // Envoyer en form-data (pas JSON)
      const tokenResponse = await api.post<Token>('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      const token = tokenResponse.data.access_token

      // Étape 2 : Stocker le token dans localStorage
      localStorage.setItem('token', token)

      // Étape 3 : Récupérer les infos de l'utilisateur connecté
      const userResponse = await api.get<User>('/auth/me')
      const user = userResponse.data

      // Étape 4 : Stocker l'utilisateur dans localStorage
      localStorage.setItem('user', JSON.stringify(user))

      // Étape 5 : Mettre à jour le store Zustand
      set({
        user,
        token,
        isAuthenticated: true,
      })
    } catch (error) {
      // En cas d'erreur, nettoyer tout
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      })
      throw error // Relancer l'erreur pour que le composant puisse l'afficher
    }
  },

  /**
   * Register - Créer un nouveau compte utilisateur
   *
   * 1. Envoie email + password au backend
   * 2. Le backend crée le compte et retourne l'utilisateur
   * 3. Connecte automatiquement l'utilisateur (appelle login)
   */
  register: async (userData: UserCreate) => {
    try {
      // Créer le compte
      await api.post('/auth/register', userData)

    } catch (error) {
      throw error
    }
  },

  /**
   * Logout - Déconnecter l'utilisateur
   *
   * 1. Supprime token + user de localStorage
   * 2. Réinitialise le store
   */
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  /**
   * InitializeAuth - Restaurer la session depuis localStorage
   *
   * Appelé au démarrage de l'app pour vérifier si l'utilisateur
   * était déjà connecté (token + user dans localStorage)
   */
  initializeAuth: () => {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        set({
          user,
          token,
          isAuthenticated: true,
        })
      } catch (error) {
        // Si parsing échoue, nettoyer localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
  },
}))
