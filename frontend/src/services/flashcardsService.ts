import api from './api'
import type { FlashCard, FlashCardCreate, FlashCardUpdate } from '../types'

/**
 * Service pour gérer les flashcards
 *
 * Toutes les fonctions utilisent l'instance Axios configurée (api)
 * qui ajoute automatiquement le token JWT via l'interceptor
 */

/**
 * Récupérer toutes les flashcards de l'utilisateur connecté
 *
 * Optionnel : Filtrer par catégorie avec categoryId
 *
 * @param categoryId - ID de la catégorie (optionnel)
 * @returns Promise<FlashCard[]>
 *
 * Exemple :
 * const allCards = await getFlashcards()
 * const mathCards = await getFlashcards(1)
 */
export const getFlashcards = async (categoryId?: number): Promise<FlashCard[]> => {
  const params = categoryId ? { category_id: categoryId } : {}
  const response = await api.get<FlashCard[]>('/flashcards', { params })
  return response.data
}

/**
 * Récupérer une flashcard spécifique par son ID
 *
 * @param id - ID de la flashcard
 * @returns Promise<FlashCard>
 */
export const getFlashcard = async (id: number): Promise<FlashCard> => {
  const response = await api.get<FlashCard>(`/flashcards/${id}`)
  return response.data
}

/**
 * Créer une nouvelle flashcard
 *
 * @param data - Données de la flashcard (question, answer, category_id)
 * @returns Promise<FlashCard> - La flashcard créée avec son ID
 *
 * Exemple :
 * const newCard = await createFlashcard({
 *   question: "What is React?",
 *   answer: "A JavaScript library",
 *   category_id: 1
 * })
 */
export const createFlashcard = async (data: FlashCardCreate): Promise<FlashCard> => {
  const response = await api.post<FlashCard>('/flashcards', data)
  return response.data
}

/**
 * Mettre à jour une flashcard existante
 *
 * @param id - ID de la flashcard à modifier
 * @param data - Nouvelles données (question, answer, category_id)
 * @returns Promise<FlashCard> - La flashcard mise à jour
 */
export const updateFlashcard = async (
  id: number,
  data: FlashCardUpdate
): Promise<FlashCard> => {
  const response = await api.put<FlashCard>(`/flashcards/${id}`, data)
  return response.data
}

/**
 * Supprimer une flashcard
 *
 * @param id - ID de la flashcard à supprimer
 * @returns Promise<void>
 *
 * Note : Le backend retourne 204 No Content (pas de body)
 */
export const deleteFlashcard = async (id: number): Promise<void> => {
  await api.delete(`/flashcards/${id}`)
}

/**
 * Rechercher des flashcards par mot-clé
 *
 * Recherche dans les questions ET les réponses
 *
 * @param query - Mot-clé à rechercher
 * @returns Promise<FlashCard[]>
 *
 * Exemple :
 * const results = await searchFlashcards("react")
 */
export const searchFlashcards = async (query: string): Promise<FlashCard[]> => {
  const response = await api.get<FlashCard[]>('/flashcards/search', {
    params: { q: query },
  })
  return response.data
}
