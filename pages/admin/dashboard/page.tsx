"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/admin-layout"
import { Spinner } from "@/components/ui/spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface DashboardStats {
  totalEquipment: number
  totalRequests: number
  pendingRequests: number
  activeLoans: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    totalRequests: 0,
    pendingRequests: 0,
    activeLoans: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("user_role")

    if (!token || (role !== "admin" && role !== "staff")) {
      router.push("/login")
      return
    }

    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access_token")

      const [equipmentRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/equipment/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/requests/`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (equipmentRes.ok && requestsRes.ok) {
        const equipmentData = await equipmentRes.json()
        const requestsData = await requestsRes.json()

        const requests = requestsData.results || requestsData
        const pending = requests.filter((r: any) => r.status === "pending").length
        const active = requests.filter((r: any) => r.status === "issued").length

        setStats({
          totalEquipment: (equipmentData.results || equipmentData).length,
          totalRequests: requests.length,
          pendingRequests: pending,
          activeLoans: active,
        })
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage equipment and borrowing requests</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-6 rounded-lg border border-border bg-background">
              <p className="text-muted-foreground text-sm mb-2">Total Equipment</p>
              <p className="text-3xl font-bold text-primary">{stats.totalEquipment}</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <p className="text-muted-foreground text-sm mb-2">Total Requests</p>
              <p className="text-3xl font-bold text-primary">{stats.totalRequests}</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <p className="text-muted-foreground text-sm mb-2">Pending Approvals</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-background">
              <p className="text-muted-foreground text-sm mb-2">Active Loans</p>
              <p className="text-3xl font-bold text-blue-600">{stats.activeLoans}</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
