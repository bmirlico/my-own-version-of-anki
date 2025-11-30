import { FolderOpen, Layers } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

interface Category {
  id: number
  name: string
  count: number
}

interface DashboardStatsProps {
  totalCards: number
  categoriesWithCount: Category[]
}

function DashboardStats({ totalCards, categoriesWithCount }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Cards */}
      <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
        <CardHeader>
        <CardTitle className="text-lg font-medium text-blue-700 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Total Cards
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-900">{totalCards}</div>
          <p className="text-sm text-blue-600 mt-1">flashcards</p>
        </CardContent>
      </Card>

      {/* Cards by Category */}
      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-purple-700 flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-purple-600" />
            Cards by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesWithCount.length === 0 ? (
            <p className="text-sm text-gray-500">No categories yet</p>
          ) : (
            <div className="space-y-2">
              {categoriesWithCount.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-semibold text-gray-900">
                    {category.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardStats
