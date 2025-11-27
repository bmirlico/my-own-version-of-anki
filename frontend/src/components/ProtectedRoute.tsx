import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore, selectIsAuthenticated } from '../store/authStore'

/**
 * ProtectedRoute - Composant de layout pour les routes protégées
 *
 * Utilise le pattern Layout Route avec <Outlet /> de React Router v6
 *
 * Fonctionnement :
 * - Si l'utilisateur est authentifié → Affiche les routes enfants via <Outlet />
 * - Sinon → Redirige vers /login ET sauvegarde l'URL d'origine
 *
 * Amélioration UX : Préserve l'intention de l'utilisateur
 * Si un utilisateur non-connecté essaie d'accéder à /settings,
 * après login, il sera redirigé vers /settings (pas /dashboard)
 *
 * Exemple d'utilisation dans router.tsx :
 * {
 *   element: <ProtectedRoute />,
 *   children: [
 *     { path: '/dashboard', element: <DashboardPage /> },
 *     { path: '/settings', element: <SettingsPage /> },
 *   ]
 * }
 */
function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const location = useLocation()

  // Si pas authentifié, rediriger vers /login
  // Sauvegarde l'URL d'origine dans location.state pour y retourner après login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si authentifié, afficher les routes enfants
  // <Outlet /> est le point de montage pour les routes children
  return <Outlet />
}

export default ProtectedRoute
