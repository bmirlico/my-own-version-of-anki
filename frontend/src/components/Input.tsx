import { type InputHTMLAttributes, forwardRef } from 'react'

/**
 * Props du composant Input
 *
 * Étend InputHTMLAttributes pour hériter de toutes les props natives
 */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Label affiché au-dessus de l'input
   */
  label?: string

  /**
   * Message d'erreur affiché en dessous de l'input
   */
  error?: string

  /**
   * Texte d'aide affiché en dessous de l'input (si pas d'erreur)
   */
  helperText?: string
}

/**
 * Input - Composant input réutilisable
 *
 * Utilise forwardRef pour permettre l'accès à l'input via une ref
 * (utile pour les librairies de formulaires comme react-hook-form)
 *
 * Exemples d'utilisation :
 * <Input label="Email" type="email" />
 * <Input label="Password" type="password" error="Invalid password" />
 * <Input label="Username" helperText="Min 3 characters" />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...rest }, ref) => {
    /**
     * Classes de base de l'input
     */
    const baseClasses = `
      w-full px-4 py-2 border rounded-lg
      transition-colors
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:bg-gray-100 disabled:cursor-not-allowed
    `

    /**
     * Classes selon l'état (erreur ou normal)
     */
    const stateClasses = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500'

    const inputClasses = `${baseClasses} ${stateClasses} ${className}`.trim()

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        {/* Input */}
        <input ref={ref} className={inputClasses} {...rest} />

        {/* Message d'erreur ou helper text */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {!error && helperText && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

// Définir un displayName pour le debugging (React DevTools)
Input.displayName = 'Input'

export default Input
