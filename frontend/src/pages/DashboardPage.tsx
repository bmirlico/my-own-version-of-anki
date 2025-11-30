import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { getFlashcards, deleteFlashcard } from '../services/flashcardsService'
import { getCategories } from '../services/categoriesService'
import type { FlashCard as FlashCardType, Category } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { BookOpen, Plus, FolderPlus, LogOut } from 'lucide-react'
import DashboardStats from '../components/DashboardStats'
import FlashcardSearchBar from '../components/FlashcardSearchBar'
import FlashcardListItem from '../components/FlashcardListItem'
import FlashcardViewDialog from '../components/FlashcardViewDialog'
import CreateFlashcardModal from '../components/CreateFlashcardModal'
import EditFlashcardModal from '../components/EditFlashcardModal'
import CreateCategoryModal from '../components/CreateCategoryModal'

function DashboardPage() {
  const { user, logout } = useAuthStore()

  // États pour les flashcards et catégories
  const [flashcards, setFlashcards] = useState<FlashCardType[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // États pour les modals
  const [isFlashcardModalOpen, setIsFlashcardModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [editingFlashcard, setEditingFlashcard] = useState<FlashCardType | null>(null)
  const [viewingFlashcard, setViewingFlashcard] = useState<FlashCardType | null>(null)

  // États pour search et filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  /**
   * Charger les flashcards
   */
  const loadFlashcards = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getFlashcards()
      setFlashcards(data)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to load flashcards'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Charger les catégories
   */
  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  /**
   * Charger les données au montage
   */
  useEffect(() => {
    loadFlashcards()
    loadCategories()
  }, [])

  /**
   * Enrichir les flashcards avec l'objet category complet
   */
  const enrichedFlashcards = useMemo(() => {
    return flashcards.map((flashcard) => ({
      ...flashcard,
      category: categories.find((cat) => cat.id === flashcard.category_id),
    }))
  }, [flashcards, categories])

  /**
   * Filtrer les flashcards selon search et category
   */
  const filteredFlashcards = useMemo(() => {
    let filtered = enrichedFlashcards

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (card) => card.category_id === parseInt(selectedCategory)
      )
    }

    // Filtre par search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (card) =>
          card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [enrichedFlashcards, selectedCategory, searchQuery])

  /**
   * Calculer les stats
   */
  const stats = useMemo(() => {
    const categoriesWithCount = categories.map((category) => ({
      ...category,
      count: flashcards.filter((card) => card.category_id === category.id).length,
    }))

    return {
      totalCards: flashcards.length,
      categoriesWithCount,
    }
  }, [flashcards, categories])

  /**
   * Handlers
   */
  const handleView = (flashcard: FlashCardType) => {
    setViewingFlashcard(flashcard)
  }

  const handleEdit = (flashcard: FlashCardType) => {
    setEditingFlashcard(flashcard)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteFlashcard(id)
      loadFlashcards()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Failed to delete flashcard'
      alert(`Error: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Own Flashcards App</h1>
              <p className="text-sm text-gray-600 mt-1">Welcome, {user?.email}</p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCategoryModalOpen(true)}
                variant="outline"
                size="sm"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Category
              </Button>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading flashcards...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats */}
        {!isLoading && !error && (
          <DashboardStats
            totalCards={stats.totalCards}
            categoriesWithCount={stats.categoriesWithCount}
          />
        )}

        {/* Flashcards Section */}
        {!isLoading && !error && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Flashcards
            </h2>

            {/* Search Bar */}
            <FlashcardSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              onCreateFlashcard={() => setIsFlashcardModalOpen(true)}
            />

            {/* Empty state */}
            {filteredFlashcards.length === 0 && flashcards.length === 0 && (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <BookOpen className="h-16 w-16 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">No flashcards yet!</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Create your first flashcard to get started.
                  </p>
                  <Button onClick={() => setIsFlashcardModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Flashcard
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* No results from filters */}
            {filteredFlashcards.length === 0 && flashcards.length > 0 && (
              <Card className="text-center py-12">
                <CardContent className="pt-6">
                  <p className="text-gray-600">No flashcards match your filters.</p>
                </CardContent>
              </Card>
            )}

            {/* Flashcards List */}
            {filteredFlashcards.length > 0 && (
              <div className="space-y-4">
                {filteredFlashcards.map((card) => (
                  <FlashcardListItem
                    key={card.id}
                    flashcard={card}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => {
          loadCategories()
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

      <FlashcardViewDialog
        flashcard={viewingFlashcard}
        isOpen={viewingFlashcard !== null}
        onClose={() => setViewingFlashcard(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default DashboardPage
