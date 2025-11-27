import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '../services/api'
import type { User, Token, UserLogin, UserCreate } from '../types'

/**
 * Auth Store - Gestion de l'authentification avec Zustand + Persist Middleware
 *
 * Ce store gère :
 * - L'utilisateur connecté (user)
 * - Le token JWT (token)
 * - Les actions de login, register, logout
 *
 * Utilise le middleware persist pour :
 * - Sauvegarder automatiquement user + token dans localStorage
 * - Hydrater automatiquement le state au démarrage (pas besoin de useEffect !)
 */

interface AuthStore {
  // État (persisté automatiquement)
  user: User | null
  token: string | null

  // Actions (non persistées)
  login: (credentials: UserLogin) => Promise<void>
  register: (userData: UserCreate) => Promise<void>
  logout: () => void
}

/**
 * Hook useAuthStore
 *
 * Utilisation dans un composant :
 * const { user, token, login, logout } = useAuthStore()
 *
 * Pour vérifier l'authentification :
 * const isAuthenticated = useAuthStore((state) => state.user !== null)
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // État initial
      user: null,
      token: null,

      /**
       * Login - Authentifier un utilisateur
       *
       * 1. Envoie username (=email) + password au backend en form-data
       * 2. Reçoit un token JWT
       * 3. Récupère les infos utilisateur
       * 4. Met à jour le store (persist sauvegarde automatiquement dans localStorage)
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

          // Étape 2 : Mettre le token dans le store IMMÉDIATEMENT
          // ✅ Important : L'interceptor axios a besoin du token dans le store
          // pour l'ajouter au header de la requête /auth/me
          set({ token })

          // Étape 3 : Récupérer les infos de l'utilisateur connecté
          // L'interceptor va maintenant ajouter "Authorization: Bearer {token}"
          const userResponse = await api.get<User>('/auth/me')
          const user = userResponse.data

          // Étape 4 : Mettre à jour le store avec l'utilisateur complet
          // ✅ Persist middleware sauvegarde automatiquement dans localStorage !
          set({
            user,
            token, // On remet le token pour garder la cohérence
          })
        } catch (error) {
          // En cas d'erreur, nettoyer tout
          set({
            user: null,
            token: null,
          })
          throw error // Relancer l'erreur pour que le composant puisse l'afficher
        }
      },

      /**
       * Register - Créer un nouveau compte utilisateur
       *
       * 1. Envoie email + password au backend
       * 2. Le backend crée le compte et retourne l'utilisateur
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
       * Met à jour le store à null
       * ✅ Persist middleware supprime automatiquement de localStorage !
       */
      logout: () => {
        set({
          user: null,
          token: null,
        })
      },
    }),
    {
      name: 'auth-storage', // Nom de la clé dans localStorage

      // Utilise localStorage pour la persistance
      storage: createJSONStorage(() => localStorage),

      /**
       * Partialize - Ne persister QUE les données, PAS les fonctions
       *
       * Important : JSON.stringify() ne peut pas sérialiser les fonctions
       * On ne sauvegarde donc que user et token (pas login, register, logout)
       */
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        // login, register, logout ne sont PAS persistés (c'est voulu !)
      }),
    }
  )
)

/**
 * Selector helper pour vérifier l'authentification
 *
 * Utilisation :
 * const isAuthenticated = useAuthStore(selectIsAuthenticated)
 */
export const selectIsAuthenticated = (state: AuthStore) => state.user !== null
