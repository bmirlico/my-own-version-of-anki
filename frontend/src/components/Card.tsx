import { type HTMLAttributes } from 'react'

/**
 * Props du composant Card
 *
 * Étend HTMLAttributes pour hériter de toutes les props HTML (onClick, className, etc.)
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Titre optionnel de la carte (affiché en haut)
   */
  title?: string

  /**
   * Actions optionnelles (boutons, liens, etc.) affichées en haut à droite
   * Exemple : bouton Edit, Delete
   */
  actions?: React.ReactNode

  /**
   * Padding interne de la carte
   * - sm: petit padding
   * - md: padding moyen (défaut)
   * - lg: grand padding
   */
  padding?: 'sm' | 'md' | 'lg'

  /**
   * Afficher un hover effect (ombre plus prononcée au survol)
   */
  hover?: boolean
}

/**
 * Card - Composant carte réutilisable
 *
 * Utilisé pour afficher du contenu dans un container stylé avec ombre et bords arrondis
 *
 * Exemples d'utilisation :
 * <Card>Simple content</Card>
 * <Card title="My Card" actions={<Button>Edit</Button>}>Content</Card>
 * <Card hover onClick={handleClick}>Clickable card</Card>
 */
function Card({
  children,
  title,
  actions,
  padding = 'md',
  hover = false,
  className = '',
  ...rest
}: CardProps) {
  /**
   * Classes de base de la carte
   */
  const baseClasses = 'bg-white rounded-lg shadow-md border border-gray-200'

  /**
   * Classes selon le padding
   */
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  /**
   * Effet hover optionnel
   */
  const hoverClasses = hover
    ? 'transition-shadow hover:shadow-lg cursor-pointer'
    : ''

  /**
   * Combiner toutes les classes
   */
  const cardClasses = `
    ${baseClasses}
    ${paddingClasses[padding]}
    ${hoverClasses}
    ${className}
  `.trim()

  return (
    <div className={cardClasses} {...rest}>
      {/* Header (titre + actions) si titre ou actions fournis */}
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {/* Titre */}
          {title && (
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          )}

          {/* Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}

      {/* Contenu de la carte */}
      {children}
    </div>
  )
}

export default Card
