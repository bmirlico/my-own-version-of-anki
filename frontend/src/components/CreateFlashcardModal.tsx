import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { flashcardSchema, type FlashcardFormData } from '../types/schemas'
import { createFlashcard } from '../services/flashcardsService'
import { getCategories } from '../services/categoriesService'
import type { Category } from '../types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Label } from './ui/label'

interface CreateFlashcardModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

function CreateFlashcardModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateFlashcardModalProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [apiError, setApiError] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
      loadCategories()
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FlashcardFormData>({
    resolver: zodResolver(flashcardSchema) as any,
    defaultValues: {
      question: '',
      answer: '',
      category_id: 0,
    },
  })

  const onSubmit = async (data: FlashcardFormData) => {
    setApiError('')

    try {
      await createFlashcard(data)
      reset()
      setSelectedCategoryId('')
      onClose()
      onSuccess()
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || 'Failed to create flashcard'
      setApiError(errorMessage)
    }
  }

  const handleClose = () => {
    reset()
    setApiError('')
    setSelectedCategoryId('')
    onClose()
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value)
    setValue('category_id', parseInt(value))
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Flashcard</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Error message */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              {...register('question')}
              placeholder="What is React?"
              rows={3}
              disabled={isSubmitting}
              className={errors.question ? 'border-red-500' : ''}
            />
            {errors.question && (
              <p className="text-sm text-red-600">{errors.question.message}</p>
            )}
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              {...register('answer')}
              placeholder="A JavaScript library for building user interfaces"
              rows={4}
              disabled={isSubmitting}
              className={errors.answer ? 'border-red-500' : ''}
            />
            {errors.answer && (
              <p className="text-sm text-red-600">{errors.answer.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={selectedCategoryId}
              onValueChange={handleCategoryChange}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-sm text-red-600">{errors.category_id.message}</p>
            )}
            {categories.length === 0 && !isSubmitting && (
              <p className="text-sm text-gray-500">
                No categories yet. Create one first!
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateFlashcardModal
