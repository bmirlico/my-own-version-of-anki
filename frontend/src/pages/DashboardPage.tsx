import { useAuthStore } from '../store/authStore'

/**
 * DashboardPage - Page principale (protégée)
 *
 * Accessible uniquement si l'utilisateur est connecté
 * Temporaire : Juste pour tester le routing et l'authentification
 */
function DashboardPage() {
  const { user, logout } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Bienvenue, {user?.email} ! 🎉
          </p>
          <p className="text-gray-500 text-sm mb-6">
            (Page temporaire - on va créer la vraie interface bientôt)
          </p>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
