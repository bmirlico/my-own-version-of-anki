import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { Search, Plus, Filter } from 'lucide-react'
import type { Category } from '../types'

interface FlashcardSearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  categories: Category[]
  onCreateFlashcard: () => void
}

function FlashcardSearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  onCreateFlashcard,
}: FlashcardSearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      {/* Search input - Modern with subtle shadow */}
      <div className="flex-1 relative group">
        <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          type="text"
          placeholder="Search flashcards..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white border-gray-200 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 text-sm shadow-sm hover:shadow-md transition-all duration-200 rounded-lg"
        />
      </div>

      {/* Category filter - Enhanced styling */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[220px] bg-white border-gray-200 hover:border-purple-300 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 text-sm shadow-sm hover:shadow-md transition-all duration-200 rounded-lg py-2.5">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <SelectValue placeholder="All Categories" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-lg shadow-xl border-gray-200">
          <SelectItem value="all" className="cursor-pointer">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id.toString()}
              className="cursor-pointer"
            >
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* New Card button - Already perfect with gradient */}
      <Button
        onClick={onCreateFlashcard}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 font-semibold px-6"
      >
        <Plus className="mr-2 h-5 w-5" />
        New Card
      </Button>
    </div>
  )
}

export default FlashcardSearchBar
