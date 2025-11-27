import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, selectIsAuthenticated } from './store/authStore'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

/**
 * App - Composant racine de l'application
 *
 * Configure React Router et gère l'authentification
 *
 * Note : Plus besoin de useEffect pour initializeAuth() !
 * Le middleware persist de Zustand hydrate automatiquement le state
 * depuis localStorage AVANT le premier render.
 */
function App() {
  // Utilise le selector pour dériver isAuthenticated de user !== null
  const isAuthenticated = useAuthStore(selectIsAuthenticated)

  return (
    <BrowserRouter>
      <Routes>
        {/* Route racine : redirige selon l'état d'authentification */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Routes publiques (accessible sans être connecté) */}
        {/* Si déjà authentifié, rediriger vers dashboard */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        {/* Routes protégées (accessible uniquement si connecté) */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Route 404 : toutes les autres URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
