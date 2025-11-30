import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import type { FlashCard } from '../types'

interface FlashcardViewDialogProps {
  flashcard: FlashCard | null
  isOpen: boolean
  onClose: () => void
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

  const hash = categoryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

function FlashcardViewDialog({
  flashcard,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: FlashcardViewDialogProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  // Reset flip state when dialog closes
  const handleClose = () => {
    setIsFlipped(false)
    onClose()
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleEdit = () => {
    if (flashcard) {
      handleClose()
      onEdit(flashcard)
    }
  }

  const handleDelete = () => {
    if (flashcard && window.confirm(`Delete flashcard: "${flashcard.question}"?`)) {
      handleClose()
      onDelete(flashcard.id)
    }
  }

  if (!flashcard) return null

  const categoryName = flashcard.category?.name || 'Uncategorized'
  const categoryColor = getCategoryColor(categoryName)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{flashcard.question}</span>
            <Badge variant="outline" className={categoryColor}>
              {categoryName}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Flashcard avec animation flip */}
        <div className="py-6">
          <div
            className="flashcard-container cursor-pointer"
            onClick={handleFlip}
            style={{ perspective: '1000px', height: '300px' }}
          >
            <div
              className="flashcard-inner relative w-full h-full transition-transform duration-600"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front (Question) */}
              <div
                className="flashcard-face absolute w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg border-2 border-blue-500 flex flex-col items-center justify-center p-8"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-semibold mb-4">
                    QUESTION
                  </p>
                  <p className="text-xl font-medium text-gray-800">
                    {flashcard.question}
                  </p>
                </div>

                <div className="absolute bottom-4 text-gray-500 text-sm">
                  Click to reveal answer
                </div>
              </div>

              {/* Back (Answer) */}
              <div
                className="flashcard-face absolute w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg border-2 border-green-500 flex flex-col items-center justify-center p-8"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="text-center">
                  <p className="text-sm text-green-600 font-semibold mb-4">
                    ANSWER
                  </p>
                  <p className="text-xl font-medium text-gray-800">
                    {flashcard.answer}
                  </p>
                </div>

                <div className="absolute bottom-4 text-gray-500 text-sm">
                  Click to see question
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleEdit}>
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
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
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
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FlashcardViewDialog
