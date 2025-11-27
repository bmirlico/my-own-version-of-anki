import { z } from 'zod'

/**
 * Schéma de validation pour le formulaire de Login
 *
 * Qu'est-ce qu'un schéma Zod ?
 * - Définit la structure attendue des données
 * - Valide automatiquement les données
 * - Génère des types TypeScript automatiquement
 */
export const loginSchema = z.object({
  /**
   * Email : doit être une chaîne de caractères valide
   *
   * .email() : Vérifie que c'est un email valide (contient @, domaine, etc.)
   * Le message personnalisé s'affiche si la validation échoue
   */
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  /**
   * Password : doit être une chaîne de caractères d'au moins 8 caractères
   *
   * .min(8) : Minimum 8 caractères
   * On pourrait ajouter d'autres règles :
   * - .regex(/[A-Z]/, 'Must contain uppercase')
   * - .regex(/[0-9]/, 'Must contain number')
   */
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

/**
 * Type TypeScript inféré automatiquement depuis le schéma
 *
 * z.infer<typeof loginSchema> génère automatiquement :
 * {
 *   email: string
 *   password: string
 * }
 *
 * Plus besoin de définir l'interface manuellement !
 */
export type LoginFormData = z.infer<typeof loginSchema>

/**
 * Schéma de validation pour le formulaire de Register
 *
 * Utilise .refine() pour une validation personnalisée
 * (vérifier que password et confirmPassword sont identiques)
 */
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),

    /**
     * Champ de confirmation du mot de passe
     * On va vérifier qu'il correspond au password
     */
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  /**
   * .refine() : Validation personnalisée
   *
   * Vérifie que password === confirmPassword
   * Si la fonction retourne false, la validation échoue
   */
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // L'erreur sera affichée sur le champ confirmPassword
  })

export type RegisterFormData = z.infer<typeof registerSchema>

/**
 * Schéma de validation pour créer/éditer une catégorie
 */
export const categorySchema = z.object({
  /**
   * Nom de la catégorie
   * - Au moins 1 caractère
   * - Maximum 50 caractères (pour éviter les noms trop longs)
   */
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters'),
})

export type CategoryFormData = z.infer<typeof categorySchema>

/**
 * Schéma de validation pour créer/éditer une flashcard
 */
export const flashcardSchema = z.object({
  /**
   * Question de la flashcard
   * - Au moins 1 caractère
   * - On pourrait limiter à 500 caractères si besoin
   */
  question: z
    .string()
    .min(1, 'Question is required')
    .max(500, 'Question is too long'),

  /**
   * Réponse de la flashcard
   * - Au moins 1 caractère
   * - On pourrait limiter à 1000 caractères si besoin
   */
  answer: z
    .string()
    .min(1, 'Answer is required')
    .max(1000, 'Answer is too long'),

  /**
   * ID de la catégorie associée
   * - Doit être un nombre positif
   * - Transformation automatique de string à number si besoin
   */
  category_id: z.coerce.number().positive('Please select a category'),
})

export type FlashcardFormData = z.infer<typeof flashcardSchema>
