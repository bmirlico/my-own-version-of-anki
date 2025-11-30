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
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Own Flashcards App
                </h1>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-gray-600 font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsCategoryModalOpen(true)}
                variant="outline"
                size="sm"
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300 hover:border-gray-400 transition-all"
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Category</span>
                <span className="sm:hidden">Category</span>
              </Button>
              <Button 
                onClick={logout} 
                variant="ghost" 
                size="sm"
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading state */}
        {/* TODO: add spinner instead */}
        {isLoading && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">Loading flashcards...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-8 text-sm">
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">
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
              <div className="text-center py-10 animate-in fade-in duration-500">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No flashcards yet!</h3>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                  Create your first flashcard to get started on your learning journey.
                </p>
                <Button 
                  onClick={() => setIsFlashcardModalOpen(true)} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Flashcard
                </Button>
              </div>
            )}

            {/* No results from filters */}
            {filteredFlashcards.length === 0 && flashcards.length > 0 && (
              <div className="text-center py-20 animate-in fade-in duration-300">
                <p className="text-sm text-gray-500">No flashcards match your filters.</p>
              </div>
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
