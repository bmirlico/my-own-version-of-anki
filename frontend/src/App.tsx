import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Pages (on va les créer juste après)
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

/**
 * App - Composant racine de l'application
 *
 * Configure React Router et initialise l'authentification
 */
function App() {
  const { initializeAuth, isAuthenticated } = useAuthStore()

  /**
   * useEffect qui s'exécute au démarrage de l'app
   * Restaure la session depuis localStorage si l'utilisateur était connecté
   */
  useEffect(() => {
    initializeAuth()
  }, [])

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
