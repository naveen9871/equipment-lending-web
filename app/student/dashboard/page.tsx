"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StudentLayout from "@/components/layouts/student-layout"
import EquipmentCard from "@/components/equipment-card"
import { Spinner } from "@/components/ui/spinner"

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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchEquipment()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm, selectedCategory])

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: string } = {
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

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Welcome back, {userName}!
              </h1>
              <p className="text-blue-100 text-lg">
                Discover and borrow equipment for your projects and activities
              </p>
            </div>
            <div className="mt-4 md:mt-0 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100">Ready to create something amazing?</p>
              <p className="text-xl font-bold mt-1">Start borrowing today!</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Equipment
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by equipment name, description, or features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quick Categories
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 border-2 ${
                  selectedCategory === "all"
                    ? "bg-indigo-600 text-white border-transparent"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                }`}
              >
                All Items
              </button>
              {categories.slice(0, 4).map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id.toString())}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 border-2 flex items-center space-x-2 ${
                    selectedCategory === category.id.toString()
                      ? "bg-indigo-600 text-white border-transparent"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  <span>{getCategoryIcon(category.name)}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Available Equipment
              </h2>
              <p className="text-gray-600 mt-1">
                {equipment.length} item{equipment.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== "all" && ` in ${categories.find(c => c.id.toString() === selectedCategory)?.name}`}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Equipment Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 border-3 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading available equipment...</p>
            </div>
          </div>
        ) : (
          <>
            {equipment.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {equipment.map((item) => (
                  <EquipmentCard 
                    key={item.id} 
                    equipment={item} 
                    isStudent={true}
                    className="hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300"
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Equipment Found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {searchTerm || selectedCategory !== "all" 
                    ? "Try adjusting your search criteria or browse all categories."
                    : "All equipment is currently checked out. Please check back later."
                  }
                </p>
                {(searchTerm || selectedCategory !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                    }}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Browse All Equipment
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Help Section */}
        {!loading && equipment.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Need help choosing equipment?</h3>
                <p className="text-blue-700 text-sm">
                  Check equipment availability, read descriptions carefully, and make sure to specify your intended use when requesting items.
                  Most equipment can be borrowed for up to 7 days.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}