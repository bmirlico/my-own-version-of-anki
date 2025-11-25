import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '../store/authStore'
import { loginSchema, type LoginFormData } from '../types/schemas'
import Button from '../components/Button'
import Input from '../components/Input'

/**
 * LoginPage - Page de connexion avec react-hook-form + Zod
 */
function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  // État pour l'erreur globale (erreur API)
  const [apiError, setApiError] = useState('')

  /**
   * useForm - Hook principal de react-hook-form
   *
   * Configuration :
   * - resolver: zodResolver(loginSchema)
   *   → Utilise Zod pour valider le formulaire
   *   → Connecte react-hook-form et Zod ensemble
   *
   * - defaultValues: { email: '', password: '' }
   *   → Valeurs initiales du formulaire
   *   → Important pour les champs contrôlés
   *
   * Ce que useForm retourne :
   * - register: Fonction pour enregistrer un champ
   * - handleSubmit: Gère la soumission du formulaire
   * - formState: État du formulaire (errors, isSubmitting, etc.)
   */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  /**
   * onSubmit - Fonction appelée quand le formulaire est soumis
   *
   * IMPORTANT :
   * - Cette fonction N'EST APPELÉE QUE si la validation Zod réussit !
   * - Si validation échoue, react-hook-form bloque automatiquement
   * - `data` est typé automatiquement comme LoginFormData
   */
  const onSubmit = async (data: LoginFormData) => {
    // Réinitialiser l'erreur API
    setApiError('')

    try {
      // Appeler le store Zustand pour login
      await login(data)

      // Si succès, rediriger vers dashboard
      navigate('/dashboard')
    } catch (err: any) {
      // Afficher l'erreur retournée par l'API
      const errorMessage =
        err.response?.data?.detail || 'Login failed. Please try again.'
      setApiError(errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access your flashcards</p>
        </div>

        {/**
         * handleSubmit(onSubmit) - Gestion de la soumission
         *
         * Comment ça fonctionne :
         * 1. User clique "Sign In"
         * 2. handleSubmit récupère les données du formulaire
         * 3. Valide avec le schéma Zod
         * 4. Si validation OK → Appelle onSubmit(data)
         * 5. Si validation FAIL → Bloque et affiche les erreurs
         */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Message d'erreur API (pas une erreur de validation) */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {apiError}
            </div>
          )}

          {/**
           * register('email') - Enregistrer le champ email
           *
           * Ce que ça fait :
           * - Connecte l'input au formulaire react-hook-form
           * - Ajoute automatiquement onChange, onBlur, ref, name
           * - Track la valeur du champ
           *
           * {...register('email')} se décompose en :
           * {
           *   onChange: (e) => setValue('email', e.target.value),
           *   onBlur: () => trigger('email'),
           *   ref: inputRef,
           *   name: 'email'
           * }
           */}
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            error={errors.email?.message}
            disabled={isSubmitting}
          />

          {/**
           * errors.email?.message - Message d'erreur Zod
           *
           * Si validation échoue :
           * - Zod retourne le message défini dans le schéma
           * - Exemple : "Invalid email address"
           * - react-hook-form le stocke dans errors.email.message
           */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            disabled={isSubmitting}
          />

          {/**
           * isSubmitting - État automatique de react-hook-form
           *
           * - true : Pendant l'exécution de onSubmit()
           * - false : Après que onSubmit() se termine (succès ou erreur)
           *
           * Permet de désactiver le bouton pendant la soumission
           */}
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        {/* Link to Register */}
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
