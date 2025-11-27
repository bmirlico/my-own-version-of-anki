import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { getFlashcards } from '../services/flashcardsService'
import type { FlashCard } from '../types'
import Button from '../components/Button'
import Card from '../components/Card'
import CreateFlashcardModal from '../components/CreateFlashcardModal'

/**
 * DashboardPage - Page principale de l'application
 *
 * Affiche :
 * - Header avec email de l'utilisateur et bouton logout
 * - Liste des flashcards
 * - États de loading et erreur
 */
function DashboardPage() {
  const { user, logout } = useAuthStore()

  // États pour les flashcards
  const [flashcards, setFlashcards] = useState<FlashCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // État pour le modal de création
  const [isModalOpen, setIsModalOpen] = useState(false)

  /**
   * Fonction pour charger les flashcards
   * Peut être appelée au montage ET après création d'une nouvelle flashcard
   */
  const loadFlashcards = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Appel API pour récupérer les flashcards
      const data = await getFlashcards()
      setFlashcards(data)
    } catch (err: any) {
      // Gérer l'erreur
      const errorMessage =
        err.response?.data?.detail || 'Failed to load flashcards'
      setError(errorMessage)
    } finally {
      // Toujours désactiver le loading (succès ou erreur)
      setIsLoading(false)
    }
  }

  /**
   * useEffect pour charger les flashcards au montage du composant
   */
  useEffect(() => {
    loadFlashcards()
  }, []) // [] = s'exécute une seule fois au montage

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header / Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo / Titre */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Flashcards</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsModalOpen(true)} size="sm">
                Create Flashcard
              </Button>
              <Button onClick={logout} variant="secondary" size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* État de loading */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading flashcards...</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* État vide (pas de flashcards) */}
        {!isLoading && !error && flashcards.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-600 mb-4">No flashcards yet!</p>
            <p className="text-sm text-gray-500">
              Create your first flashcard to get started.
            </p>
          </Card>
        )}

        {/* Liste des flashcards */}
        {!isLoading && !error && flashcards.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Flashcards ({flashcards.length})
              </h2>
            </div>

            {/* Grille de flashcards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flashcards.map((card) => (
                <Card key={card.id} hover>
                  {/* Question */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Question</p>
                    <p className="text-gray-800 font-medium">{card.question}</p>
                  </div>

                  {/* Answer */}
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Answer</p>
                    <p className="text-gray-600">{card.answer}</p>
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400">
                      Category ID: {card.category_id}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modal de création de flashcard */}
      <CreateFlashcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadFlashcards}
      />
    </div>
  )
}

export default DashboardPage
