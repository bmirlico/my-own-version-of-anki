import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

/**
 * RootRedirect - Redirige la route / selon l'état d'authentification
 * - Si connecté → /dashboard
 * - Sinon → /login
 */
function RootRedirect() {
  const user = useAuthStore((state) => state.user)
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

/**
 * Configuration du router avec createBrowserRouter
 *
 * Structure symétrique :
 * - Route racine (/) : Redirige vers /login ou /dashboard selon auth
 * - PublicRoute (parent) : Routes publiques accessibles si NON authentifié
 *   ├── /login
 *   └── /register
 * - ProtectedRoute (parent) : Routes protégées accessibles si authentifié
 *   └── /dashboard
 *
 * Avantages de createBrowserRouter :
 * - Support des Data APIs (loaders, actions)
 * - Meilleure gestion des erreurs
 * - Navigation state management (useNavigation)
 * - Code plus organisé et scalable
 * - Architecture symétrique (PublicRoute ↔ ProtectedRoute)
 */
export const router = createBrowserRouter([
  // Route racine : redirige selon l'authentification
  {
    path: '/',
    element: <RootRedirect />,
  },

  // Routes publiques (accessibles uniquement si NON authentifié)
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      // Ajouter d'autres routes publiques ici :
      // {
      //   path: '/forgot-password',
      //   element: <ForgotPasswordPage />,
      // },
    ],
  },

  // Routes protégées (accessibles uniquement si authentifié)
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      // Ajouter d'autres routes protégées ici :
      // {
      //   path: '/settings',
      //   element: <SettingsPage />,
      // },
    ],
  },

  // Route 404 : toutes les autres URLs redirigent vers /
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
