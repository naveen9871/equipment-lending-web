"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StudentLayout from "@/components/layouts/student-layout"
import { Spinner } from "@/components/ui/spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface BorrowRequest {
  id: number
  equipment: { id: number; name: string }
  quantity: number
  purpose: string
  status: string
  borrow_from: string
  borrow_until: string
  created_at: string
}

export default function StudentRequests() {
  const router = useRouter()
  const [requests, setRequests] = useState<BorrowRequest[]>([])
  const [loading, setLoading] = useState(true)

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
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "approved":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "rejected":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      case "issued":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20"
      case "returned":
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">My Requests</h1>
          <p className="text-muted-foreground">Track your equipment borrowing requests</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 rounded-lg border border-border bg-background hover:border-primary transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{request.equipment.name}</h3>
                      <p className="text-muted-foreground text-sm">Quantity: {request.quantity}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(request.status)}`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{request.purpose}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">From</p>
                      <p className="text-foreground">{new Date(request.borrow_from).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Until</p>
                      <p className="text-foreground">{new Date(request.borrow_until).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No requests yet. Start by borrowing some equipment!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
