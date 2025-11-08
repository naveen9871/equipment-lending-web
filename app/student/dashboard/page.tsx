"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import StudentLayout from "@/components/layouts/student-layout"
import EquipmentCard from "@/components/equipment-card"
import { Spinner } from "@/components/ui/spinner"
import { Search, Filter, X, Sparkles, TrendingUp, Clock, Shield } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Equipment {
  id: number
  name: string
  category: { name: string }
  description: string
  condition: string
  total_quantity: number
  available_quantity: number
  image_url?: string
}

interface Category {
  id: number
  name: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [userName, setUserName] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchUserProfile()
    fetchEquipment()
    fetchCategories()
  }, [router])

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/users/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const userData = await response.json()
        setUserName(userData.first_name || userData.username)
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
    }
  }

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("access_token")
      let url = `${API_URL}/api/equipment/?available=true`

      if (searchTerm && searchTerm !== "") url += `&search=${encodeURIComponent(searchTerm)}`
      if (selectedCategory && selectedCategory !== "all") url += `&category=${selectedCategory}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setEquipment(data.results || data)
      }
    } catch (error) {
      console.error("Failed to fetch equipment:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCategories(data.results || data)
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  // Proper debounced search implementation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEquipment()
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedCategory])

  const getCategoryIcon = (categoryName: string) => {
    // Add null/undefined check
    if (!categoryName) {
      return "📦"
    }

    const icons: Record<string, string> = {
      "Photography": "📷",
      "Sports": "⚽",
      "Laboratory": "🔬",
      "Music": "🎵",
      "Art": "🎨",
      "Technology": "💻",
      "General": "📦"
    }
    
    for (const [key, icon] of Object.entries(icons)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return icon
      }
    }
    return "📦"
  }

  const getCategoryColor = (categoryName: string) => {
    // Add null/undefined check
    if (!categoryName) {
      return "from-gray-500 to-slate-500"
    }

    const colors: Record<string, string> = {
      "Photography": "from-purple-500 to-pink-500",
      "Sports": "from-green-500 to-blue-500",
      "Laboratory": "from-orange-500 to-red-500",
      "Music": "from-yellow-500 to-orange-500",
      "Art": "from-pink-500 to-rose-500",
      "Technology": "from-blue-500 to-cyan-500",
      "General": "from-gray-500 to-slate-500"
    }
    
    for (const [key, color] of Object.entries(colors)) {
      if (categoryName.toLowerCase().includes(key.toLowerCase())) {
        return color
      }
    }
    return "from-gray-500 to-slate-500"
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
    setIsFilterOpen(false)
  }

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all"

  return (
    <StudentLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="space-y-8 relative">
          {/* Enhanced Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <span className="text-blue-100 text-sm font-medium bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                      Welcome back!
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Hello, {userName}!
                  </h1>
                  <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                    Discover amazing equipment for your next project. What will you create today?
                  </p>
                </div>
                <div className="mt-6 md:mt-0">
                  <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-3">
                      <TrendingUp className="w-5 h-5 text-green-300" />
                      <span className="text-green-300 text-sm font-semibold">Quick Access</span>
                    </div>
                    <p className="text-white text-lg font-semibold mb-2">Ready to explore?</p>
                    <p className="text-blue-100 text-sm">Browse our curated collection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search cameras, laptops, sports gear..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-12 py-4 rounded-2xl border border-gray-200 bg-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 backdrop-blur-sm"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      viewMode === "grid" 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-current rounded-sm" />
                      ))}
                    </div>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-xl transition-all duration-200 ${
                      viewMode === "list" 
                        ? "bg-white text-indigo-600 shadow-sm" 
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="w-5 h-5 flex flex-col space-y-0.5">
                      <div className="bg-current h-1 rounded-full" />
                      <div className="bg-current h-1 rounded-full" />
                      <div className="bg-current h-1 rounded-full" />
                    </div>
                  </button>
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`px-4 py-2 rounded-2xl border-2 transition-all duration-200 flex items-center space-x-2 ${
                    hasActiveFilters
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                      : "border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced Filter Panel */}
            {isFilterOpen && (
              <div className="border-t border-gray-100 pt-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Additional filter options can be added here */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Availability
                    </label>
                    <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
                      <option value="all">All Items</option>
                      <option value="available">Available Now</option>
                      <option value="low">Low Stock</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Condition
                    </label>
                    <select className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200">
                      <option value="all">Any Condition</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-gray-600 to-slate-700 text-white font-semibold hover:from-gray-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Category Filters */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                Popular Categories
              </label>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 border-2 backdrop-blur-sm ${
                    selectedCategory === "all"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg scale-105"
                      : "bg-white/50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-105"
                  }`}
                >
                  🌟 All Items
                </button>
                {categories.slice(0, 6).map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    className={`px-5 py-3 rounded-2xl font-semibold transition-all duration-300 border-2 backdrop-blur-sm flex items-center space-x-2 ${
                      selectedCategory === category.id.toString()
                        ? `bg-gradient-to-r ${getCategoryColor(category.name)} text-white border-transparent shadow-lg scale-105`
                        : "bg-white/50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:scale-105"
                    }`}
                  >
                    <span className="text-lg">{getCategoryIcon(category.name)}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          {!loading && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Available Equipment
                  </h2>
                  <p className="text-gray-600 mt-1">
                    {equipment.length} item{equipment.length !== 1 ? 's' : ''} found
                    {searchTerm && ` for "${searchTerm}"`}
                    {selectedCategory !== "all" && ` in ${categories.find(c => c.id.toString() === selectedCategory)?.name}`}
                  </p>
                </div>
                {hasActiveFilters && (
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    Filters Active
                  </span>
                )}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-2xl border-2 border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all duration-200 flex items-center space-x-2 hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </div>
          )}

          {/* Equipment Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="relative">
                  {/* Custom Spinner with your design */}
                  <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 mx-auto mb-6"></div>
                  <div className="absolute inset-0 animate-ping">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-600/30 border-t-indigo-600/30 mx-auto mb-6"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg">Discovering amazing equipment...</p>
                <p className="text-gray-400 text-sm mt-2">This will just take a moment</p>
              </div>
            </div>
          ) : (
            <>
              {equipment.length > 0 ? (
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {equipment.map((item) => (
                    <EquipmentCard 
                      key={item.id} 
                      equipment={item} 
                      isStudent={true}
                      viewMode={viewMode}
                      className="hover:shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl border border-white/60 shadow-2xl">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <div className="text-4xl">🔍</div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Equipment Found</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      {searchTerm || selectedCategory !== "all" 
                        ? "We couldn't find any equipment matching your criteria. Try adjusting your search or browse different categories."
                        : "All equipment is currently checked out. New items are added regularly, so check back soon!"
                      }
                    </p>
                    {(searchTerm || selectedCategory !== "all") && (
                      <button
                        onClick={clearFilters}
                        className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 inline-flex items-center space-x-2"
                      >
                        <span>✨</span>
                        <span>Browse All Equipment</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Enhanced Help Section */}
          {!loading && equipment.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl border border-blue-100/60 p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Getting Started Guide</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 text-sm font-bold">1</span>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Check Availability</p>
                        <p className="text-blue-700 text-sm">Real-time availability shown for all items</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 text-sm font-bold">2</span>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Read Descriptions</p>
                        <p className="text-blue-700 text-sm">Detailed specs and usage guidelines provided</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-blue-600 text-sm font-bold">3</span>
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Specify Purpose</p>
                        <p className="text-blue-700 text-sm">Clear purpose helps with faster approval</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">Borrowing Period</p>
                        <p className="text-blue-700 text-sm">Most items available for 7-14 days</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-64 flex-shrink-0">
                  <div className="bg-white/60 rounded-2xl p-4 border border-blue-200/60">
                    <p className="text-blue-900 font-semibold mb-2">Need Help?</p>
                    <p className="text-blue-700 text-sm mb-3">Our support team is here to assist you with any questions.</p>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  )
}