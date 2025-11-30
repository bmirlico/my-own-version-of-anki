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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
      {/* Total Cards */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50/50 via-white to-white hover:scale-[1.02] group">
        <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Layers className="h-4 w-4 text-blue-600" />
            </div>
            Total Cards
        </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-gray-900 mb-1">{totalCards}</div>
          <p className="text-xs text-gray-500">flashcards</p>
        </CardContent>
      </Card>

      {/* Cards by Category */}
      <Card className="border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50/50 via-white to-white hover:scale-[1.02] group">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
              <FolderOpen className="h-4 w-4 text-purple-600" />
            </div>
            Cards by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categoriesWithCount.length === 0 ? (
            <p className="text-xs text-gray-400">No categories yet</p>
          ) : (
            <div className="space-y-2.5">
              {categoriesWithCount.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between text-sm hover:bg-purple-50/30 -mx-2 px-2 py-1 rounded transition-colors"
                >
                  <span className="text-gray-700">{category.name}</span>
                  <span className="font-bold text-gray-900 text-base">
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
