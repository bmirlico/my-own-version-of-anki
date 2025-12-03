import { FolderOpen, Layers, TrendingUp } from 'lucide-react'
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {/* Total Cards - Modern Design */}
      <Card className="relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-slate-200/[0.3] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/40 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />

        <CardHeader className="relative pb-2">
          <CardTitle className="text-sm font-semibold text-blue-600 flex items-center gap-2 uppercase tracking-wider">
            <div className="p-2 bg-blue-500/10 backdrop-blur-sm rounded-xl group-hover:bg-blue-500/20 transition-all duration-300 group-hover:rotate-6">
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            Total Cards
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex items-end gap-3 mb-2">
            <div className="text-6xl font-black text-gray-800 tracking-tight">
              {totalCards}
            </div>
            <TrendingUp className="h-8 w-8 text-blue-500/70 mb-2 animate-pulse" />
          </div>
          <p className="text-sm text-gray-600 font-medium">
            flashcards in your collection
          </p>
        </CardContent>
      </Card>

      {/* Cards by Category - Modern Design */}
      <Card className="relative border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden group">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-blue-50/30 group-hover:from-purple-50/80 group-hover:to-blue-50/50 transition-all duration-500" />

        <CardHeader className="relative pb-4">
          <CardTitle className="text-sm font-semibold text-purple-600 flex items-center gap-2 uppercase tracking-wider">
            <div className="p-2 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-all duration-300 group-hover:rotate-6">
              <FolderOpen className="h-5 w-5 text-purple-600" />
            </div>
            Cards by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          {categoriesWithCount.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FolderOpen className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No categories yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {categoriesWithCount.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between py-2.5 px-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 -mx-2 transition-all duration-300 group/item cursor-pointer border border-transparent hover:border-purple-200"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover/item:text-gray-900 transition-colors">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover/item:scale-110 transition-transform duration-300">
                      <span className="font-black text-white text-sm">
                        {category.count}
                      </span>
                    </div>
                  </div>
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
