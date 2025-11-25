import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../store/authStore'
import { registerSchema, type RegisterFormData } from '../types/schemas'
import Button from '../components/Button'
import Input from '../components/Input'

/**
 * RegisterPage - Page d'inscription avec react-hook-form + Zod
 *
 * Similaire à LoginPage, mais avec un champ supplémentaire :
 * - confirmPassword (avec validation que password === confirmPassword)
 */
function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuthStore()

  // État pour l'erreur globale (erreur API)
  const [apiError, setApiError] = useState('')

  /**
   * useForm avec le schéma de Register
   *
   * Note : On a 3 champs ici (email, password, confirmPassword)
   * Le schéma Zod va valider que password === confirmPassword
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  /**
   * onSubmit - Fonction appelée si la validation Zod réussit
   *
   * Note : On envoie seulement email + password au backend
   * (pas confirmPassword, c'est juste pour la validation frontend)
   */
  const onSubmit = async (data: RegisterFormData) => {
    setApiError('')

    try {
      // registerUser attend { email, password } seulement
      // On extrait confirmPassword car le backend n'en a pas besoin
      const { confirmPassword, ...userData } = data

      await registerUser(userData)

      // Si succès, l'utilisateur est automatiquement connecté
      // (voir authStore.ts : register() appelle login() automatiquement)
      navigate('/login')
    } catch (err: any) {
      // Gérer les erreurs courantes
      if (err.response?.status === 400) {
        setApiError('This email is already registered')
      } else {
        const errorMessage =
          err.response?.data?.detail || 'Registration failed. Please try again.'
        setApiError(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Sign up to start learning with flashcards</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Message d'erreur API */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          {/* Email Input */}
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          {/* Password Input */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            helperText="At least 8 characters"
            {...register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />

          {/**
           * Confirm Password Input
           *
           * Si password !== confirmPassword :
           * - Le .refine() du schéma Zod échoue
           * - errors.confirmPassword.message = "Passwords do not match"
           */}
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            disabled={isSubmitting}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Account
          </Button>
        </form>

        {/* Link to Login */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
