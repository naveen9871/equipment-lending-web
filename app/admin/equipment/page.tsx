"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/admin-layout"
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
  is_active: boolean
}

interface Category {
  id: number
  name: string
}

export default function AdminEquipment() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    condition: "excellent",
    total_quantity: 1,
  })

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchEquipment()
    fetchCategories()
  }, [router])

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/equipment/`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("access_token")

    try {
      const url = editingId ? `${API_URL}/api/equipment/${editingId}/` : `${API_URL}/api/equipment/`
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowModal(false)
        setEditingId(null)
        setFormData({ name: "", category: "", description: "", condition: "excellent", total_quantity: 1 })
        fetchEquipment()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (item: Equipment) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      category: item.category.id.toString(),
      description: item.description,
      condition: item.condition,
      total_quantity: item.total_quantity,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this equipment? This action cannot be undone.")) {
      return
    }

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/equipment/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchEquipment()
      }
    } catch (error) {
      console.error("Error deleting equipment:", error)
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent": return "bg-green-100 text-green-800 border-green-200"
      case "good": return "bg-blue-100 text-blue-800 border-blue-200"
      case "fair": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "poor": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total
    if (ratio === 0) return "bg-red-100 text-red-800 border-red-200"
    if (ratio < 0.3) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-green-100 text-green-800 border-green-200"
  }

  // Filter equipment based on search and category
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category.name === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Equipment Management</h1>
            <p className="text-gray-600">Manage and track all school equipment inventory</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: "", category: categories[0]?.id.toString() || "", description: "", condition: "excellent", total_quantity: 1 })
              setShowModal(true)
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add New Equipment</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Equipment</label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                }}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 border-3 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading equipment inventory...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Equipment Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Condition</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Availability</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEquipment.length > 0 ? (
                    filteredEquipment.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                            {item.category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize ${getConditionColor(item.condition)}`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getAvailabilityColor(item.available_quantity, item.total_quantity)}`}>
                              {item.available_quantity}/{item.total_quantity} available
                            </span>
                            {item.available_quantity === 0 && (
                              <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 font-medium text-sm border border-blue-200 hover:border-blue-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all duration-200 font-medium text-sm border border-red-200 hover:border-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <div className="text-4xl mb-3">🔍</div>
                          <p className="text-lg font-semibold mb-2">No equipment found</p>
                          <p>Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Equipment" : "Add New Equipment"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Equipment Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter equipment name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={3}
                  placeholder="Describe the equipment, features, and specifications..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="excellent">Excellent - Like new</option>
                  <option value="good">Good - Minor wear</option>
                  <option value="fair">Fair - Functional but worn</option>
                  <option value="poor">Poor - Needs maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formData.total_quantity}
                  onChange={(e) => setFormData({ ...formData, total_quantity: Number.parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {editingId ? "Update Equipment" : "Add Equipment"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}