import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flashcardSchema, type FlashcardFormData } from '../types/schemas'
import { createFlashcard } from '../services/flashcardsService'
import { getCategories } from '../services/categoriesService'
import type { Category } from '../types'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'

/**
 * Props du composant CreateFlashcardModal
 */
interface CreateFlashcardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void // Callback appelé après création réussie
}

/**
 * CreateFlashcardModal - Modal pour créer une nouvelle flashcard
 *
 * Utilise react-hook-form + Zod pour la validation
 */
function CreateFlashcardModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateFlashcardModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [apiError, setApiError] = useState('')

  /**
   * Charger les catégories quand le modal s'ouvre
   */
  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  /**
   * Charger la liste des catégories
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
   * Configuration react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FlashcardFormData>({
    resolver: zodResolver(flashcardSchema),
    defaultValues: {
      question: '',
      answer: '',
      category_id: 0,
    },
  })

  /**
   * Gérer la soumission du formulaire
   */
  const onSubmit = async (data: FlashcardFormData) => {
    setApiError('')

    try {
      await createFlashcard(data)

      // Réinitialiser le formulaire
      reset()

      // Fermer le modal
      onClose()

      // Appeler le callback de succès (pour recharger la liste)
      onSuccess()
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Failed to create flashcard'
      setApiError(errorMessage)
    }
  }

  /**
   * Gérer la fermeture du modal
   * Réinitialise le formulaire et les erreurs
   */
  const handleClose = () => {
    reset()
    setApiError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Flashcard" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Message d'erreur API */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        {/* Question (Textarea) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <textarea
            {...register('question')}
            className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.question
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={3}
            placeholder="What is React?"
            disabled={isSubmitting}
          />
          {errors.question && (
            <p className="mt-1 text-sm text-red-600">{errors.question.message}</p>
          )}
        </div>

        {/* Answer (Textarea) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Answer
          </label>
          <textarea
            {...register('answer')}
            className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.answer
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            rows={4}
            placeholder="A JavaScript library for building user interfaces"
            disabled={isSubmitting}
          />
          {errors.answer && (
            <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
          )}
        </div>

        {/* Category (Select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            {...register('category_id')}
            className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.category_id
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category_id.message}
            </p>
          )}

          {/* Message si pas de catégories */}
          {categories.length === 0 && !isSubmitting && (
            <p className="mt-1 text-sm text-gray-500">
              No categories yet. Create one first!
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateFlashcardModal
