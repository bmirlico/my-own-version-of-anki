// User types
export interface User {
  id: number
  email: string
  created_at: string
}

export interface UserCreate {
  email: string
  password: string
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserResponse {
  id: number
  email: string
  created_at: string
}

// Auth types
export interface Token {
  access_token: string
  token_type: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

// Category types
export interface Category {
  id: number
  name: string
  user_id: number
  created_at: string
}

export interface CategoryCreate {
  name: string
}

export interface CategoryUpdate {
  name: string
}

// FlashCard types
export interface FlashCard {
  id: number
  question: string
  answer: string
  category_id: number
  user_id: number
  created_at: string
  updated_at: string
}

export interface FlashCardCreate {
  question: string
  answer: string
  category_id: number
}

export interface FlashCardUpdate {
  question: string
  answer: string
  category_id: number
}

// API Response types
export interface APIError {
  detail: string
}
