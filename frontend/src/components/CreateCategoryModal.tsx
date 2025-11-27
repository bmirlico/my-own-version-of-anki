import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, type CategoryFormData } from '../types/schemas'
import { createCategory } from '../services/categoriesService'
import Modal from './Modal'
import Button from './Button'

/**
 * Props du composant CreateCategoryModal
 */
interface CreateCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void // Callback appelé après création réussie
}

/**
 * CreateCategoryModal - Modal pour créer une nouvelle catégorie
 *
 * Utilise react-hook-form + Zod pour la validation
 * Beaucoup plus simple que CreateFlashcardModal car un seul champ (name)
 */
function CreateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) {
  const [apiError, setApiError] = useState('')

  /**
   * Configuration react-hook-form avec validation Zod
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  })

  /**
   * Gérer la soumission du formulaire
   */
  const onSubmit = async (data: CategoryFormData) => {
    setApiError('')

    try {
      await createCategory(data)

      // Réinitialiser le formulaire
      reset()

      // Fermer le modal
      onClose()

      // Appeler le callback de succès (pour recharger la liste)
      onSuccess()
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Failed to create category'
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Category" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Message d'erreur API */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {apiError}
          </div>
        )}

        {/* Name (Input) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            {...register('name')}
            type="text"
            className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="Mathematics"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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

export default CreateCategoryModal
