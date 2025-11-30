import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import type { FlashCard } from '../types'

interface FlashcardListItemProps {
  flashcard: FlashCard
  onView: (flashcard: FlashCard) => void
  onEdit: (flashcard: FlashCard) => void
  onDelete: (id: number) => void
}

// Fonction pour obtenir une couleur basée sur le nom de la catégorie
const getCategoryColor = (categoryName: string) => {
  const colors = [
    'bg-blue-100 text-blue-700 border-blue-300',
    'bg-purple-100 text-purple-700 border-purple-300',
    'bg-green-100 text-green-700 border-green-300',
    'bg-orange-100 text-orange-700 border-orange-300',
    'bg-pink-100 text-pink-700 border-pink-300',
    'bg-indigo-100 text-indigo-700 border-indigo-300',
  ]

  // Hash simple du nom pour avoir toujours la même couleur pour la même catégorie
  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

function FlashcardListItem({
  flashcard,
  onView,
  onEdit,
  onDelete,
}: FlashcardListItemProps) {
  const handleDelete = () => {
    if (window.confirm(`Delete flashcard: "${flashcard.question}"?`)) {
      onDelete(flashcard.id)
    }
  }

  const categoryName = flashcard.category?.name || 'Uncategorized'
  const categoryColor = getCategoryColor(categoryName)

  // Tronquer la réponse pour le preview
  const answerPreview =
    flashcard.answer.length > 100
      ? flashcard.answer.substring(0, 100) + '...'
      : flashcard.answer

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView(flashcard)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            {/* Question */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {flashcard.question}
            </h3>

            {/* Preview de la réponse */}
            <p className="text-sm text-gray-600 mb-3">{answerPreview}</p>

            {/* Footer: Date */}
            <p className="text-xs text-gray-400">
              Created {formatDate(flashcard.created_at)}
            </p>
          </div>

          {/* Sidebar: Badge + Menu */}
          <div className="flex items-start gap-2">
            {/* Badge catégorie */}
            <Badge variant="outline" className={`shrink-0 ${categoryColor}`}>
              {categoryName}
            </Badge>

            {/* Menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(flashcard)
                  }}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="text-red-600"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FlashcardListItem
