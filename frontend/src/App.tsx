import { RouterProvider } from 'react-router-dom'
import { router } from './router'

/**
 * App - Composant racine de l'application
 *
 * Utilise RouterProvider avec createBrowserRouter (React Router v6 Data API)
 *
 * Avantages de createBrowserRouter :
 * - Support des loaders pour pré-charger les données
 * - Meilleure gestion des erreurs avec errorElement
 * - Navigation state management (useNavigation)
 * - Architecture plus propre avec Layout Routes (<Outlet />)
 *
 * Note : Plus besoin de useEffect pour initializeAuth() !
 * Le middleware persist de Zustand hydrate automatiquement le state
 * depuis localStorage AVANT le premier render.
 *
 * Future additions possibles ici :
 * - QueryClientProvider (TanStack Query)
 * - ThemeProvider (dark mode)
 * - ToastProvider (notifications)
 */
function App() {
  return <RouterProvider router={router} />
}

export default App
