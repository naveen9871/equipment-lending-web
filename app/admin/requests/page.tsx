"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/admin-layout"
import { Spinner } from "@/components/ui/spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface BorrowRequest {
  id: number
  equipment: { id: number; name: string; available_quantity: number }
  user: { id: number; username: string; first_name: string; last_name: string; email: string }
  quantity: number
  purpose: string
  status: string
  borrow_from: string
  borrow_until: string
  created_at: string
  notes?: string
}

export default function AdminRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")
  const [selectedRequest, setSelectedRequest] = useState<BorrowRequest | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchRequests()
  }, [router, statusFilter])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("access_token")
      let url = `${API_URL}/api/requests/`
      if (statusFilter) url += `?status=${statusFilter}`

      const response = await fetch(url, {
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

  const handleApprove = async (requestId: number) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/requests/${requestId}/approve/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to approve request:", error)
    }
  }

  const handleReject = async (requestId: number) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/requests/${requestId}/reject/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: "Request rejected by staff" }),
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to reject request:", error)
    }
  }

  const handleIssue = async (requestId: number) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/requests/${requestId}/issue/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to issue equipment:", error)
    }
  }

  const handleReturn = async (requestId: number) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/requests/${requestId}/return/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchRequests()
      }
    } catch (error) {
      console.error("Failed to mark as returned:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved": return "bg-blue-100 text-blue-800 border-blue-200"
      case "issued": return "bg-green-100 text-green-800 border-green-200"
      case "returned": return "bg-gray-100 text-gray-800 border-gray-200"
      case "rejected": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return "⏳"
      case "approved": return "✅"
      case "issued": return "🚀"
      case "returned": return "📦"
      case "rejected": return "❌"
      default: return "📋"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)
    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Borrowing Requests</h1>
            <p className="text-gray-600">Manage and process equipment borrowing requests from users</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="text-sm text-gray-500 bg-blue-50 rounded-xl px-4 py-2 border border-blue-200">
              <span className="font-semibold text-blue-700">{requests.length}</span> requests found
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Filter by Status</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "pending", label: "Pending Review", count: requests.filter(r => r.status === "pending").length },
              { key: "approved", label: "Approved", count: requests.filter(r => r.status === "approved").length },
              { key: "issued", label: "Issued", count: requests.filter(r => r.status === "issued").length },
              { key: "returned", label: "Returned", count: requests.filter(r => r.status === "returned").length },
              { key: "rejected", label: "Rejected", count: requests.filter(r => r.status === "rejected").length },
            ].map(({ key, label, count }) => (
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
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 border-3 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading borrowing requests...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Request Details */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{request.equipment.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Quantity: <strong className="text-gray-900">{request.quantity}</strong></span>
                            <span>•</span>
                            <span>Available: <strong className="text-gray-900">{request.equipment.available_quantity}</strong></span>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}>
                          <span className="mr-2">{getStatusIcon(request.status)}</span>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-700">Requested By</p>
                          <p className="text-gray-900">{request.user.first_name} {request.user.last_name}</p>
                          <p className="text-sm text-gray-600">{request.user.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-700">Borrow Period</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900">{formatDate(request.borrow_from)}</span>
                            <span className="text-gray-400">→</span>
                            <span className="text-gray-900">{formatDate(request.borrow_until)}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {getDaysUntil(request.borrow_until) > 0 
                              ? `${getDaysUntil(request.borrow_until)} days remaining` 
                              : 'Due soon'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-700">Purpose</p>
                          <p className="text-gray-900 line-clamp-2">{request.purpose}</p>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Additional Notes</p>
                          <p className="text-gray-900 text-sm">{request.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 min-w-[200px]">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="w-full px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                          >
                            <span>✅</span>
                            <span>Approve Request</span>
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="w-full px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                          >
                            <span>❌</span>
                            <span>Reject Request</span>
                          </button>
                        </>
                      )}

                      {request.status === "approved" && (
                        <button
                          onClick={() => handleIssue(request.id)}
                          className="w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                        >
                          <span>🚀</span>
                          <span>Issue Equipment</span>
                        </button>
                      )}

                      {request.status === "issued" && (
                        <button
                          onClick={() => handleReturn(request.id)}
                          className="w-full px-4 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                        >
                          <span>📦</span>
                          <span>Mark as Returned</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedRequest(request)
                          setShowModal(true)
                        }}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <span>🔍</span>
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {statusFilter === "pending" 
                    ? "There are no pending requests to review at the moment." 
                    : `No ${statusFilter} requests found.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Equipment Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900 text-lg">{selectedRequest.equipment.name}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <span>Requested: <strong className="text-gray-900">{selectedRequest.quantity}</strong></span>
                      <span>•</span>
                      <span>Available: <strong className="text-gray-900">{selectedRequest.equipment.available_quantity}</strong></span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Status</h3>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                    <span className="mr-2 text-lg">{getStatusIcon(selectedRequest.status)}</span>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">User Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="font-semibold text-gray-900">{selectedRequest.user.first_name} {selectedRequest.user.last_name}</p>
                    <p className="text-sm text-gray-600 mt-1">@{selectedRequest.user.username}</p>
                    <p className="text-sm text-gray-600">{selectedRequest.user.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Borrowing Period</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">From</p>
                        <p className="font-semibold text-gray-900">{formatDate(selectedRequest.borrow_from)}</p>
                      </div>
                      <span className="text-gray-400 text-xl">→</span>
                      <div>
                        <p className="text-sm text-gray-600">Until</p>
                        <p className="font-semibold text-gray-900">{formatDate(selectedRequest.borrow_until)}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-center">
                      <span className="text-sm text-gray-600">
                        {getDaysUntil(selectedRequest.borrow_until) > 0 
                          ? `${getDaysUntil(selectedRequest.borrow_until)} days remaining` 
                          : 'Due soon'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Purpose & Notes</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-900">{selectedRequest.purpose}</p>
                  {selectedRequest.notes && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Additional Notes:</p>
                      <p className="text-gray-900 text-sm">{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}