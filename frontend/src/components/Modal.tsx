import { useEffect, useRef } from 'react'
import Button from './Button'

/**
 * Props du composant Modal
 */
interface ModalProps {
  /**
   * Contrôle si le modal est ouvert ou fermé
   */
  isOpen: boolean

  /**
   * Fonction appelée quand on veut fermer le modal
   * (clic sur backdrop, bouton close, touche Escape)
   */
  onClose: () => void

  /**
   * Titre du modal (affiché en haut)
   */
  title: string

  /**
   * Contenu du modal (formulaire, texte, etc.)
   */
  children: React.ReactNode

  /**
   * Taille du modal
   */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Modal - Composant modal (popup) réutilisable
 *
 * Fonctionnalités :
 * - Backdrop cliquable pour fermer
 * - Bouton X pour fermer
 * - Touche Escape pour fermer
 * - Bloque le scroll de la page quand ouvert
 *
 * Exemple d'utilisation :
 * const [isOpen, setIsOpen] = useState(false)
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Card">
 *   <form>...</form>
 * </Modal>
 */
function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  /**
   * Gérer la touche Escape pour fermer le modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  /**
   * Bloquer le scroll de la page quand le modal est ouvert
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  /**
   * Ne rien afficher si le modal est fermé
   */
  if (!isOpen) return null

  /**
   * Tailles du modal
   */
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }

  /**
   * Gérer le clic sur le backdrop (ferme le modal)
   * mais pas le clic sur le contenu du modal
   */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    // Backdrop (overlay sombre)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      {/* Contenu du modal */}
      <div
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

          {/* Bouton Close */}
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="p-2"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Body (contenu) */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}

export default Modal
