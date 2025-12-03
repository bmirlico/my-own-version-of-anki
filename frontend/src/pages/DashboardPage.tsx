import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { getFlashcards, deleteFlashcard } from '../services/flashcardsService'
import { getCategories } from '../services/categoriesService'
import type { FlashCard as FlashCardType, Category } from '../types'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { BookOpen, Plus, Sparkles, TrendingUp } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Modern Header with gradient */}
      <header className="relative border-b border-gray-200 bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo, Title and User */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  My Own Flashcards App
                </h1>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-gray-600 font-medium">{user?.email}</p>
              </div>
            </div>

            {/* Right side - Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCategoryModalOpen(true)}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 border-none"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Category
              </Button>
              <Button
                onClick={logout}
                size="sm"
                className="bg-white hover:bg-red-50 border-2 border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-600 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Loading state */}
        {/* TODO: use spinner instead */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading your flashcards...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                  Your Learning Journey
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredFlashcards.length} {filteredFlashcards.length === 1 ? 'card' : 'cards'} to review
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <FlashcardSearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              categories={categories}
              onCreateFlashcard={() => setIsFlashcardModalOpen(true)}
            />

            {/* Empty state - No cards at all */}
            {filteredFlashcards.length === 0 && flashcards.length === 0 && (
              <Card className="border-2 border-dashed border-gray-300 bg-white/50 backdrop-blur-sm">
                <CardContent className="py-20 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
                      <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl">
                        <BookOpen className="h-20 w-20 text-blue-500" />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Your Learning Journey</h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Create your first flashcard and begin mastering new concepts. Learning has never been this beautiful!
                  </p>
                  <Button
                    onClick={() => setIsFlashcardModalOpen(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Create Your First Flashcard
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* No results from filters */}
            {filteredFlashcards.length === 0 && flashcards.length > 0 && (
              <Card className="bg-white/50 backdrop-blur-sm">
                <CardContent className="py-16 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No cards found</h3>
                  <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
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
