import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore, selectIsAuthenticated } from '../store/authStore'

/**
 * ProtectedRoute - Composant de layout pour les routes protégées
 *
 * Utilise le pattern Layout Route avec <Outlet /> de React Router v6
 *
 * Fonctionnement :
 * - Si l'utilisateur est authentifié → Affiche les routes enfants via <Outlet />
 * - Sinon → Redirige vers /login
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

  // Si pas authentifié, rediriger vers /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Si authentifié, afficher les routes enfants
  // <Outlet /> est le point de montage pour les routes children
  return <Outlet />
}

export default ProtectedRoute
