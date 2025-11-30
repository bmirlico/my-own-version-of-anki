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
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      {/* Search input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 bg-white border-gray-200 focus:border-gray-300 text-sm"
        />
      </div>

      {/* Category filter */}
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-200 text-sm">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* New Card button */}
      <Button onClick={onCreateFlashcard} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
        <Plus className="mr-2 h-4 w-4" />
        New Card
      </Button>
    </div>
  )
}

export default FlashcardSearchBar
