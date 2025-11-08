"use client"

import { useState } from "react"
import { X, Calendar, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

interface BorrowModalProps {
  isOpen: boolean
  onClose: () => void
  equipment: {
    id: number
    name: string
    available_quantity: number
    total_quantity: number
  }
  onSubmit: (data: BorrowRequestData) => Promise<void>
}

export interface BorrowRequestData {
  equipment: number
  quantity: number
  purpose: string
  borrow_from: string
  borrow_until: string
  notes?: string
}

export default function BorrowModal({ isOpen, onClose, equipment, onSubmit }: BorrowModalProps) {
  const [formData, setFormData] = useState<BorrowRequestData>({
    equipment: equipment.id,
    quantity: 1,
    purpose: "",
    borrow_from: "",
    borrow_until: "",
    notes: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.purpose.trim()) {
      newErrors.purpose = "Purpose is required"
    } else if (formData.purpose.length < 10) {
      newErrors.purpose = "Please provide a more detailed purpose (min. 10 characters)"
    }

    if (!formData.borrow_from) {
      newErrors.borrow_from = "Start date is required"
    }

    if (!formData.borrow_until) {
      newErrors.borrow_until = "End date is required"
    }

    if (formData.borrow_from && formData.borrow_until) {
      const start = new Date(formData.borrow_from)
      const end = new Date(formData.borrow_until)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (start < today) {
        newErrors.borrow_from = "Start date cannot be in the past"
      }

      if (end <= start) {
        newErrors.borrow_until = "End date must be after start date"
      }

      const maxDays = 14
      const diffTime = end.getTime() - start.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > maxDays) {
        newErrors.borrow_until = `Maximum borrowing period is ${maxDays} days`
      }
    }

    if (formData.quantity < 1) {
      newErrors.quantity = "Quantity must be at least 1"
    } else if (formData.quantity > equipment.available_quantity) {
      newErrors.quantity = `Only ${equipment.available_quantity} items available`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      onClose()
      // Reset form
      setFormData({
        equipment: equipment.id,
        quantity: 1,
        purpose: "",
        borrow_from: "",
        borrow_until: "",
        notes: ""
      })
      setErrors({})
    } catch (error) {
      console.error("Failed to submit request:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof BorrowRequestData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const getTomorrowDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30) // 30 days max in future
    return maxDate.toISOString().split('T')[0]
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Borrow Equipment</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    Request to borrow {equipment.name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 group"
              >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
            
            {/* Availability Badge */}
            <div className="flex items-center space-x-2 mt-4">
              <div className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm ${
                equipment.available_quantity > 0 
                  ? "bg-green-500/20 text-green-100 border border-green-400/30"
                  : "bg-red-500/20 text-red-100 border border-red-400/30"
              }`}>
                {equipment.available_quantity > 0 
                  ? `${equipment.available_quantity} available` 
                  : "Out of stock"
                }
              </div>
              {equipment.available_quantity > 0 && equipment.available_quantity < 3 && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-amber-500/20 text-amber-100 rounded-full text-xs border border-amber-400/30">
                  <AlertCircle className="w-3 h-3" />
                  <span>Low stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Quantity Needed
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1"
                      max={equipment.available_quantity}
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    Max: {equipment.available_quantity} available
                  </div>
                </div>
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.quantity}</span>
                  </p>
                )}
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Purpose of Use *
                </label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  placeholder="Please describe what you'll be using this equipment for..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.purpose}</span>
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-2">
                  Be specific about your project or activity. This helps us process your request faster.
                </p>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Start Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      min={getTomorrowDate()}
                      max={getMaxDate()}
                      value={formData.borrow_from}
                      onChange={(e) => handleInputChange('borrow_from', e.target.value)}
                      className="w-full px-12 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {errors.borrow_from && (
                    <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.borrow_from}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      min={formData.borrow_from || getTomorrowDate()}
                      max={getMaxDate()}
                      value={formData.borrow_until}
                      onChange={(e) => handleInputChange('borrow_until', e.target.value)}
                      className="w-full px-12 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  {errors.borrow_until && (
                    <p className="text-red-500 text-sm mt-2 flex items-center space-x-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.borrow_until}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any special requirements or notes for the staff..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              {/* Guidelines */}
              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <p className="text-blue-900 font-semibold">Before you submit:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Ensure your requested dates don't conflict with your schedule</li>
                      <li>• You'll receive email notifications about your request status</li>
                      <li>• Equipment must be returned in the same condition</li>
                      <li>• Late returns may affect future borrowing privileges</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || equipment.available_quantity === 0}
                  className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}