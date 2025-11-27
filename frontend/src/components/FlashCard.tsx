import { useState } from 'react'
import type { FlashCard as FlashCardType } from '../types'

/**
 * Props du composant FlashCard
 */
interface FlashCardProps {
  flashcard: FlashCardType
  onEdit?: (flashcard: FlashCardType) => void
  onDelete?: (id: number) => void
}

/**
 * FlashCard - Carte interactive avec animation flip 3D
 *
 * Fonctionnalités :
 * - Affiche la question sur le recto
 * - Affiche la réponse sur le verso
 * - Animation flip 3D au clic (transform: rotateY)
 * - Boutons Edit/Delete (optionnels)
 * - Utilise CSS 3D transforms et perspective
 *
 * Inspiré des vraies flashcards Anki
 */
function FlashCard({ flashcard, onEdit, onDelete }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation() // Empêche le flip de la carte
    onEdit?.(flashcard)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation() // Empêche le flip de la carte

    if (window.confirm(`Delete flashcard: "${flashcard.question}"?`)) {
      onDelete?.(flashcard.id)
    }
  }

  return (
    <div
      className="flashcard-container cursor-pointer"
      onClick={handleFlip}
      style={{ perspective: '1000px', height: '300px' }}
    >
      {/* Container qui tourne */}
      <div
        className="flashcard-inner relative w-full h-full transition-transform duration-600"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Recto (Question) */}
        <div
          className="flashcard-face absolute w-full h-full bg-white rounded-lg shadow-lg border-2 border-blue-500 flex flex-col items-center justify-center p-6"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          {/* Boutons Edit/Delete */}
          {(onEdit || onDelete) && (
            <div className="absolute top-2 right-2 flex gap-1">
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-blue-600 font-semibold mb-2">QUESTION</p>
            <p className="text-xl font-medium text-gray-800">{flashcard.question}</p>
          </div>

          {/* Indicateur pour flip */}
          <div className="absolute bottom-4 text-gray-400 text-sm">
            Click to reveal answer
          </div>
        </div>

        {/* Verso (Answer) */}
        <div
          className="flashcard-face absolute w-full h-full bg-white rounded-lg shadow-lg border-2 border-green-500 flex flex-col items-center justify-center p-6"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {/* Boutons Edit/Delete (même chose que sur le recto) */}
          {(onEdit || onDelete) && (
            <div className="absolute top-2 right-2 flex gap-1" style={{ transform: 'rotateY(180deg)' }}>
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  title="Edit"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded transition"
                  title="Delete"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-green-600 font-semibold mb-2">ANSWER</p>
            <p className="text-xl font-medium text-gray-800">{flashcard.answer}</p>
          </div>

          {/* Indicateur pour flip back */}
          <div className="absolute bottom-4 text-gray-400 text-sm">
            Click to see question
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashCard
