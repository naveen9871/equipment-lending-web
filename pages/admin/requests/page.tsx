"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/admin-layout"
import { Spinner } from "@/components/ui/spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface BorrowRequest {
  id: number
  equipment: { id: number; name: string }
  user: { id: number; username: string; first_name: string }
  quantity: number
  purpose: string
  status: string
  borrow_from: string
  borrow_until: string
}

export default function AdminRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("pending")

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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Borrow Requests</h1>
          <p className="text-muted-foreground">Manage and process equipment requests</p>
        </div>

        <div className="flex gap-2">
          {["pending", "approved", "issued", "returned", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                statusFilter === status
                  ? "bg-primary text-white"
                  : "bg-background border border-border text-foreground hover:border-primary"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div key={request.id} className="p-6 rounded-lg border border-border bg-background">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{request.equipment.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        Requested by: {request.user.first_name} ({request.user.username})
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">Purpose: {request.purpose}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="text-foreground font-medium">{request.quantity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">From</p>
                      <p className="text-foreground font-medium">
                        {new Date(request.borrow_from).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Until</p>
                      <p className="text-foreground font-medium">
                        {new Date(request.borrow_until).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  )}

                  {request.status === "approved" && (
                    <button
                      onClick={() => handleIssue(request.id)}
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                      Issue Equipment
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No requests found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
