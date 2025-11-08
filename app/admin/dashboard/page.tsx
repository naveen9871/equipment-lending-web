"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/admin-layout"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface DashboardStats {
  totalEquipment: number
  totalRequests: number
  pendingRequests: number
  activeLoans: number
  availableEquipment: number
}

interface RecentRequest {
  id: string
  user_name: string
  equipment_name: string
  status: string
  requested_date: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalEquipment: 0,
    totalRequests: 0,
    pendingRequests: 0,
    activeLoans: 0,
    availableEquipment: 0,
  })
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("user_role")
    const storedUserName = localStorage.getItem("user_name")

    if (!token || (role !== "admin" && role !== "staff")) {
      router.push("/login")
      return
    }

    if (storedUserName) {
      setUserName(storedUserName)
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("access_token")

      const [equipmentRes, requestsRes, userRes] = await Promise.all([
        fetch(`${API_URL}/api/equipment/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/requests/`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/users/me/`, { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (userRes.ok) {
        const userData = await userRes.json()
        setUserName(userData.first_name || userData.username)
        localStorage.setItem("user_name", userData.first_name || userData.username)
      }

      if (equipmentRes.ok && requestsRes.ok) {
        const equipmentData = await equipmentRes.json()
        const requestsData = await requestsRes.json()

        const equipment = equipmentData.results || equipmentData
        const requests = requestsData.results || requestsData
        
        const available = equipment.filter((item: any) => item.available_quantity > 0).length
        const pending = requests.filter((r: any) => r.status === "pending").length
        const active = requests.filter((r: any) => r.status === "issued").length

        // Get recent requests (last 5)
        const recent = requests
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((request: any) => ({
            id: request.id,
            user_name: request.user_name || `${request.user_first_name} ${request.user_last_name}`,
            equipment_name: request.equipment_name,
            status: request.status,
            requested_date: request.created_at || request.requested_date,
          }))

        setStats({
          totalEquipment: equipment.length,
          totalRequests: requests.length,
          pendingRequests: pending,
          activeLoans: active,
          availableEquipment: available,
        })
        setRecentRequests(recent)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
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

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your equipment management system.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              href="/admin/equipment"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Manage Equipment
            </Link>
            <Link
              href="/admin/requests"
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
            >
              View Requests
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Spinner className="w-12 h-12 border-3 border-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-700 text-sm font-semibold mb-2">Total Equipment</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.totalEquipment}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">📦</span>
                  </div>
                </div>
                <p className="text-blue-600 text-xs mt-3">Items in inventory</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-700 text-sm font-semibold mb-2">Available Now</p>
                    <p className="text-3xl font-bold text-green-900">{stats.availableEquipment}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">✅</span>
                  </div>
                </div>
                <p className="text-green-600 text-xs mt-3">Ready for borrowing</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-700 text-sm font-semibold mb-2">Pending Requests</p>
                    <p className="text-3xl font-bold text-amber-900">{stats.pendingRequests}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">⏳</span>
                  </div>
                </div>
                <p className="text-amber-600 text-xs mt-3">Awaiting approval</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-700 text-sm font-semibold mb-2">Active Loans</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.activeLoans}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                </div>
                <p className="text-purple-600 text-xs mt-3">Currently issued</p>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Requests */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
                  <Link 
                    href="/admin/requests" 
                    className="text-indigo-600 hover:text-indigo-700 font-medium text-sm hover:underline"
                  >
                    View all
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{request.equipment_name}</p>
                          <p className="text-sm text-gray-600 truncate">Requested by {request.user_name}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(request.requested_date)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-3">📝</div>
                      <p className="text-gray-600">No recent requests</p>
                      <p className="text-gray-500 text-sm mt-1">New requests will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                
                <div className="space-y-4">
                  <Link
                    href="/admin/equipment/new"
                    className="flex items-center p-4 bg-indigo-50 rounded-xl border border-indigo-200 hover:bg-indigo-100 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">➕</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Add New Equipment</p>
                      <p className="text-sm text-gray-600">Register new inventory items</p>
                    </div>
                  </Link>

                  <Link
                    href="/admin/requests"
                    className="flex items-center p-4 bg-amber-50 rounded-xl border border-amber-200 hover:bg-amber-100 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">📋</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Review Requests</p>
                      <p className="text-sm text-gray-600">{stats.pendingRequests} pending approvals</p>
                    </div>
                  </Link>

                  <Link
                    href="/admin/equipment"
                    className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200 hover:bg-green-100 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">🔍</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Manage Inventory</p>
                      <p className="text-sm text-gray-600">View and update equipment</p>
                    </div>
                  </Link>

                  <Link
                    href="/admin/users"
                    className="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-200 hover:bg-purple-100 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <span className="text-white text-lg">👥</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">User Management</p>
                      <p className="text-sm text-gray-600">Manage system users</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}