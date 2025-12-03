import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Edit2, Trash2, RotateCcw } from 'lucide-react'
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
    'bg-blue-100 text-blue-700 hover:bg-blue-200',
    'bg-purple-100 text-purple-700 hover:bg-purple-200',
    'bg-green-100 text-green-700 hover:bg-green-200',
    'bg-orange-100 text-orange-700 hover:bg-orange-200',
    'bg-pink-100 text-pink-700 hover:bg-pink-200',
    'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="text-xl font-bold text-gray-900 line-clamp-1">
              {flashcard.question}
            </span>
            <Badge className={`${categoryColor} font-medium px-3 py-1 shrink-0`}>
              {categoryName}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Flashcard avec animation flip moderne */}
        <div className="px-6 py-8">
          <div
            className="flashcard-container cursor-pointer group"
            onClick={handleFlip}
            style={{ perspective: '1200px', height: '320px' }}
          >
            <div
              className="flashcard-inner relative w-full h-full transition-all duration-700"
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front (Question) - Rich Blue Gradient */}
              <div
                className="flashcard-face absolute w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-2xl border border-blue-300/20 flex flex-col items-center justify-center p-10 backdrop-blur-sm"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] rounded-2xl" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl" />

                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <p className="text-xs text-white font-semibold uppercase tracking-wider">
                      Question
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-white leading-relaxed max-w-md">
                    {flashcard.question}
                  </p>
                </div>

                <div className="absolute bottom-6 flex items-center gap-2 text-white/80 text-sm">
                  <RotateCcw className="h-4 w-4" />
                  <span>Click to reveal answer</span>
                </div>
              </div>

              {/* Back (Answer) - Rich Green/Teal Gradient */}
              <div
                className="flashcard-face absolute w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl shadow-2xl border border-emerald-300/20 flex flex-col items-center justify-center p-10 backdrop-blur-sm"
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                {/* Decorative elements */}
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px] rounded-2xl" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-300/20 rounded-full blur-3xl" />

                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full mb-6">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <p className="text-xs text-white font-semibold uppercase tracking-wider">
                      Answer
                    </p>
                  </div>
                  <p className="text-2xl font-semibold text-white leading-relaxed max-w-md">
                    {flashcard.answer}
                  </p>
                </div>

                <div className="absolute bottom-6 flex items-center gap-2 text-white/80 text-sm">
                  <RotateCcw className="h-4 w-4" />
                  <span>Click to see question</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions avec style moderne */}
        <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-gray-200/50">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 transition-all"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FlashcardViewDialog
