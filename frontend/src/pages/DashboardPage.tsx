import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { getFlashcards, deleteFlashcard } from '../services/flashcardsService'
import type { FlashCard as FlashCardType } from '../types'
import Button from '../components/Button'
import Card from '../components/Card'
import FlashCard from '../components/FlashCard'
import CreateFlashcardModal from '../components/CreateFlashcardModal'
import EditFlashcardModal from '../components/EditFlashcardModal'
import CreateCategoryModal from '../components/CreateCategoryModal'

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
  const [flashcards, setFlashcards] = useState<FlashCardType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // États pour les modals
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState<FlashCardType | null>(null)

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

  /**
   * Handler pour éditer une flashcard
   */
  const handleEdit = (flashcard: FlashCardType) => {
    setEditingFlashcard(flashcard)
    // Le modal d'édition s'ouvrira automatiquement car editingFlashcard !== null
  }

  /**
   * Handler pour supprimer une flashcard
   */
  const handleDelete = async (id: number) => {
    try {
      await deleteFlashcard(id)
      // Recharger la liste après suppression
      loadFlashcards()
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Failed to delete flashcard'
      alert(`Error: ${errorMessage}`)
    }
  }

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
            <div className="flex items-center gap-3">
              <Button onClick={() => setIsCategoryModalOpen(true)} variant="secondary" size="sm">
                Create Category
              </Button>
              <Button onClick={() => setIsFlashcardModalOpen(true)} size="sm">
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
                <FlashCard
                  key={card.id}
                  flashcard={card}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          // Callback appelé après création réussie
          // Pour l'instant, on ne fait rien car on n'affiche pas la liste des catégories
          // Plus tard, tu pourras recharger la liste si tu l'affiches
          console.log('Category created successfully!')
        }}
      />

      <CreateFlashcardModal
        isOpen={isFlashcardModalOpen}
        onClose={() => setIsFlashcardModalOpen(false)}
        onSuccess={loadFlashcards}
      />

      <EditFlashcardModal
        flashcard={editingFlashcard}
        onClose={() => setEditingFlashcard(null)}
        onSuccess={loadFlashcards}
      />
    </div>
  )
}

export default DashboardPage
