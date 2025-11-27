import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated, useAuthStore } from '../store/authStore'

/**
 * PublicRoute - Composant de layout pour les routes publiques
 *
 * Symétrique de ProtectedRoute mais pour les routes publiques (login, register)
 *
 * Fonctionnement :
 * - Si l'utilisateur est déjà authentifié → Redirige vers /dashboard
 * - Sinon → Affiche les routes enfants via <Outlet />
 *
 * Exemple d'utilisation dans router.tsx :
 * {
 *   element: <PublicRoute />,
 *   children: [
 *     { path: '/login', element: <LoginPage /> },
 *     { path: '/register', element: <RegisterPage /> },
 *   ]
 * }
 */
function PublicRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  // Si déjà authentifié, rediriger vers /dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Si pas authentifié, afficher les routes enfants (login, register, etc.)
  // <Outlet /> est le point de montage pour les routes children
  return <Outlet />
}

export default PublicRoute
