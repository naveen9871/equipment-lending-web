"use client"

import { useState } from "react"
import { Calendar, Clock, AlertCircle, Star, MapPin } from "lucide-react"
import BorrowModal, { BorrowRequestData } from "./borrow-modal"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface EquipmentCardProps {
  equipment: {
    id: number
    name: string
    category: { name: string }
    description: string
    condition: string
    total_quantity: number
    available_quantity: number
    image_url?: string
    location?: string
    specifications?: Record<string, string>
  }
  isStudent: boolean
  viewMode?: "grid" | "list"
  className?: string
}

export default function EquipmentCard({ equipment, isStudent, viewMode = "grid", className = "" }: EquipmentCardProps) {
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false)

  const handleBorrowSubmit = async (data: BorrowRequestData) => {
    try {
      const token = localStorage.getItem("access_token")
      
      // Convert dates to ISO string format
      const requestData = {
        ...data,
        borrow_from: new Date(data.borrow_from).toISOString(),
        borrow_until: new Date(data.borrow_until).toISOString(),
      }

      const response = await fetch(`${API_URL}/api/requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        console.log("Borrow request submitted successfully")
        return
      } else {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to submit request")
      }
    } catch (error) {
      console.error("Error submitting borrow request:", error)
      throw error
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent": return "text-green-600 bg-green-100"
      case "good": return "text-blue-600 bg-blue-100"
      case "fair": return "text-amber-600 bg-amber-100"
      case "poor": return "text-red-600 bg-red-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

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

  // Safe category data
  const categoryName = equipment.category?.name || "General"
  const categoryIcon = getCategoryIcon(categoryName)
  const categoryColor = getCategoryColor(categoryName)

  // Grid View Layout
  if (viewMode === "grid") {
    return (
      <>
        <div className={`bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-2 ${className}`}>
          {/* Image Section */}
          <div className="relative h-48 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
            {equipment.image_url ? (
              <img 
                src={equipment.image_url} 
                alt={equipment.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl opacity-20">
                  {categoryIcon}
                </div>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span className="text-lg">{categoryIcon}</span>
                <span>{categoryName}</span>
              </span>
            </div>

            {/* Availability Badge */}
            <div className="absolute top-4 right-4">
              <div className={`px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm ${
                equipment.available_quantity > 0 
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}>
                {equipment.available_quantity > 0 
                  ? `${equipment.available_quantity} available` 
                  : "Out of stock"
                }
              </div>
            </div>

            {/* Condition Badge */}
            <div className="absolute bottom-4 left-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getConditionColor(equipment.condition)}`}>
                {equipment.condition}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Title and Description */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                {equipment.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {equipment.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Stock:</span>
                <span className="font-semibold text-gray-700">{equipment.total_quantity} units</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Available:</span>
                <span className={`font-semibold ${
                  equipment.available_quantity > 0 ? "text-green-600" : "text-red-600"
                }`}>
                  {equipment.available_quantity} units
                </span>
              </div>
              {equipment.location && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{equipment.location}</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            {isStudent && (
              <button
                onClick={() => setIsBorrowModalOpen(true)}
                disabled={equipment.available_quantity === 0}
                className={`w-full py-3.5 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  equipment.available_quantity > 0
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {equipment.available_quantity > 0 ? "Borrow Equipment" : "Out of Stock"}
              </button>
            )}
          </div>
        </div>

        <BorrowModal
          isOpen={isBorrowModalOpen}
          onClose={() => setIsBorrowModalOpen(false)}
          equipment={equipment}
          onSubmit={handleBorrowSubmit}
        />
      </>
    )
  }

  // List View Layout
  return (
    <>
      <div className={`bg-white rounded-3xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}>
        <div className="flex">
          {/* Image Section */}
          <div className="w-32 flex-shrink-0">
            <div className="h-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              {equipment.image_url ? (
                <img 
                  src={equipment.image_url} 
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-4xl opacity-30">
                  {categoryIcon}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {equipment.name}
                    </h3>
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {categoryName}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(equipment.condition)}`}>
                        {equipment.condition}
                      </span>
                    </div>
                  </div>
                  
                  {/* Availability Badge */}
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    equipment.available_quantity > 0 
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {equipment.available_quantity > 0 
                      ? `${equipment.available_quantity} available` 
                      : "Out of stock"
                    }
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">
                  {equipment.description}
                </p>

                {/* Quick Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Total: {equipment.total_quantity} units</span>
                  </div>
                  {equipment.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{equipment.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 lg:mt-0 lg:ml-6 lg:w-48">
                {isStudent && (
                  <button
                    onClick={() => setIsBorrowModalOpen(true)}
                    disabled={equipment.available_quantity === 0}
                    className={`w-full py-3.5 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                      equipment.available_quantity > 0
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-0.5"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {equipment.available_quantity > 0 ? "Borrow Now" : "Out of Stock"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BorrowModal
        isOpen={isBorrowModalOpen}
        onClose={() => setIsBorrowModalOpen(false)}
        equipment={equipment}
        onSubmit={handleBorrowSubmit}
      />
    </>
  )
}