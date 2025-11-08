"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StudentLayout from "@/components/layouts/student-layout"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface BorrowRequest {
  id: number
  equipment: { id: number; name: string; category: { name: string } }
  quantity: number
  purpose: string
  status: string
  borrow_from: string
  borrow_until: string
  created_at: string
  notes?: string
}

export default function StudentRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchRequests()
  }, [router])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/requests/my_requests/`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data.results || data)
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "issued":
        return "bg-green-100 text-green-800 border-green-200"
      case "returned":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return "⏳"
      case "approved": return "✅"
      case "rejected": return "❌"
      case "issued": return "🚀"
      case "returned": return "📦"
      default: return "📋"
    }
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

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

  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter(request => request.status === statusFilter)

  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    approved: requests.filter(r => r.status === "approved").length,
    issued: requests.filter(r => r.status === "issued").length,
    returned: requests.filter(r => r.status === "returned").length,
    rejected: requests.filter(r => r.status === "rejected").length,
  }

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Borrowing Requests</h1>
            <p className="text-gray-600 text-lg">Track and manage all your equipment requests in one place</p>
          </div>
          <Link
            href="/student/dashboard"
            className="mt-4 sm:mt-0 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 inline-flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Borrow More Equipment</span>
          </Link>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter by Status</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "All Requests" },
              { key: "pending", label: "Pending Review" },
              { key: "approved", label: "Approved" },
              { key: "issued", label: "Issued" },
              { key: "returned", label: "Returned" },
              { key: "rejected", label: "Rejected" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 border-2 ${
                  statusFilter === key
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-lg"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                <span>{getStatusIcon(key)}</span>
                <span>{label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  statusFilter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {statusCounts[key as keyof typeof statusCounts]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 border-3 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading your requests...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const daysUntil = getDaysUntil(request.borrow_until)
                const isOverdue = daysUntil < 0 && request.status === "issued"
                
                return (
                  <div
                    key={request.id}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Request Details */}
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-2xl">
                                {getCategoryIcon(request.equipment.category.name)}
                              </span>
                              <h3 className="text-xl font-bold text-gray-900">{request.equipment.name}</h3>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="bg-gray-100 rounded-full px-3 py-1 border border-gray-200">
                                {request.equipment.category.name}
                              </span>
                              <span>Quantity: <strong className="text-gray-900">{request.quantity}</strong></span>
                              <span>•</span>
                              <span>Requested: <strong className="text-gray-900">{formatDate(request.created_at)}</strong></span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}
                            >
                              <span className="mr-2">{getStatusIcon(request.status)}</span>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                            {isOverdue && (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                ⚠️ Overdue
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-700">Borrowing Period</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-900">{formatDate(request.borrow_from)}</span>
                              <span className="text-gray-400">→</span>
                              <span className="text-gray-900">{formatDate(request.borrow_until)}</span>
                            </div>
                            {request.status === "issued" && (
                              <p className={`text-sm ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                {isOverdue 
                                  ? `${Math.abs(daysUntil)} days overdue` 
                                  : `${daysUntil} days remaining`
                                }
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-700">Purpose</p>
                            <p className="text-gray-900">{request.purpose}</p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-gray-700">Request ID</p>
                            <p className="text-gray-900 font-mono">#{request.id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>

                        {request.notes && (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <p className="text-sm font-semibold text-gray-700 mb-1">Your Notes</p>
                            <p className="text-gray-900 text-sm">{request.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status-specific guidance */}
                    {request.status === "pending" && (
                      <div className="mt-4 bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-start space-x-3">
                          <span className="text-blue-600 text-lg">💡</span>
                          <div>
                            <p className="text-sm font-semibold text-blue-900">Under Review</p>
                            <p className="text-blue-700 text-sm">
                              Your request is being reviewed by staff. You'll receive an update soon.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {request.status === "approved" && (
                      <div className="mt-4 bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-start space-x-3">
                          <span className="text-green-600 text-lg">✅</span>
                          <div>
                            <p className="text-sm font-semibold text-green-900">Ready for Pickup</p>
                            <p className="text-green-700 text-sm">
                              Your request has been approved! Please visit the equipment desk to collect your items.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {isOverdue && (
                      <div className="mt-4 bg-red-50 rounded-xl p-4 border border-red-200">
                        <div className="flex items-start space-x-3">
                          <span className="text-red-600 text-lg">⚠️</span>
                          <div>
                            <p className="text-sm font-semibold text-red-900">Overdue Notice</p>
                            <p className="text-red-700 text-sm">
                              Please return the equipment immediately to avoid penalties and allow others to use it.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {statusFilter === "all" ? "No Requests Yet" : `No ${statusFilter} Requests`}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  {statusFilter === "all" 
                    ? "You haven't made any borrowing requests yet. Start by exploring available equipment!"
                    : `You don't have any ${statusFilter} requests at the moment.`
                  }
                </p>
                {statusFilter === "all" && (
                  <Link
                    href="/student/dashboard"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 inline-flex items-center space-x-2"
                  >
                    <span>🔍</span>
                    <span>Browse Available Equipment</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* Help Section */}
        {!loading && filteredRequests.length > 0 && (
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">❓</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Need help with your requests?</h3>
                <p className="text-blue-700 text-sm">
                  • <strong>Pending:</strong> Your request is under review by staff<br/>
                  • <strong>Approved:</strong> Ready for pickup at the equipment desk<br/>
                  • <strong>Issued:</strong> You have the equipment - check due dates<br/>
                  • <strong>Returned:</strong> Equipment has been successfully returned<br/>
                  • Contact support if you have questions about your requests
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  )
}