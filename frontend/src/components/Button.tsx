import type { ButtonHTMLAttributes } from 'react'

/**
 * Props du composant Button
 *
 * Étend ButtonHTMLAttributes pour hériter de toutes les props natives
 * du bouton HTML (onClick, type, disabled, etc.)
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Variante visuelle du bouton
   * - primary: Bleu (action principale)
   * - secondary: Gris (action secondaire)
   * - danger: Rouge (action destructive comme "Supprimer")
   */
  variant?: 'primary' | 'secondary' | 'danger'

  /**
   * État de chargement
   * Quand true : désactive le bouton et affiche "Loading..."
   */
  isLoading?: boolean

  /**
   * Taille du bouton
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Button - Composant bouton réutilisable
 *
 * Exemples d'utilisation :
 * <Button>Click me</Button>
 * <Button variant="danger" onClick={handleDelete}>Delete</Button>
 * <Button isLoading>Saving...</Button>
 */
function Button({
  children,
  variant = 'primary',
  isLoading = false,
  size = 'md',
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  /**
   * Classes de base (communes à tous les boutons)
   */
  const baseClasses = 'font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  /**
   * Classes selon la variante
   */
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 disabled:bg-red-300',
  }

  /**
   * Classes selon la taille
   */
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  /**
   * Combiner toutes les classes
   */
  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim()

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

export default Button
