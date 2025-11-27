import api from './api'
import type { Category, CategoryCreate, CategoryUpdate } from '../types'

/**
 * Service pour gérer les catégories
 *
 * Toutes les fonctions utilisent l'instance Axios configurée (api)
 * qui ajoute automatiquement le token JWT via l'interceptor
 */

/**
 * Récupérer toutes les catégories de l'utilisateur connecté
 *
 * @returns Promise<Category[]>
 *
 * Exemple :
 * const categories = await getCategories()
 */
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<Category[]>('/categories')
  return response.data
}

/**
 * Récupérer une catégorie spécifique par son ID
 *
 * @param id - ID de la catégorie
 * @returns Promise<Category>
 */
export const getCategory = async (id: number): Promise<Category> => {
  const response = await api.get<Category>(`/categories/${id}`)
  return response.data
}

/**
 * Créer une nouvelle catégorie
 *
 * @param data - Données de la catégorie (name)
 * @returns Promise<Category> - La catégorie créée avec son ID
 *
 * Exemple :
 * const newCategory = await createCategory({ name: "Mathematics" })
 */
export const createCategory = async (data: CategoryCreate): Promise<Category> => {
  const response = await api.post<Category>('/categories', data)
  return response.data
}

/**
 * Mettre à jour une catégorie existante
 *
 * @param id - ID de la catégorie à modifier
 * @param data - Nouvelles données (name)
 * @returns Promise<Category> - La catégorie mise à jour
 */
export const updateCategory = async (
  id: number,
  data: CategoryUpdate
): Promise<Category> => {
  const response = await api.put<Category>(`/categories/${id}`, data)
  return response.data
}

/**
 * Supprimer une catégorie
 *
 * @param id - ID de la catégorie à supprimer
 * @returns Promise<void>
 *
 * Note : Le backend supprime aussi toutes les flashcards de cette catégorie (cascade)
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categories/${id}`)
}
