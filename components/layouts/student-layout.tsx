"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { 
  Home, 
  Package, 
  FileText, 
  LogOut, 
  Menu, 
  X, 
  User,
  Bell,
  Settings,
  ChevronRight,
  Search
} from "lucide-react"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user_role")
    router.push("/login")
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/student/dashboard",
      icon: Home,
      current: pathname === "/student/dashboard"
    },
    {
      name: "Equipment",
      href: "/student/dashboard",
      icon: Package,
      current: pathname === "/student/dashboard"
    },
    {
      name: "My Requests",
      href: "/student/requests",
      icon: FileText,
      current: pathname.startsWith("/student/requests")
    }
  ]

  const notifications = [
    { id: 1, title: "Request Approved", message: "Your camera request has been approved", time: "5 min ago", read: false },
    { id: 2, title: "New Equipment", message: "New photography gear added", time: "1 hour ago", read: true },
    { id: 3, title: "Return Reminder", message: "Your laptop is due tomorrow", time: "2 hours ago", read: true }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/30">
      {/* Mobile sidebar backdrop */}
      {!sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 ${
          sidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
        } transform transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-xl border-r border-white/60 shadow-2xl`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/60">
            <div className="flex items-center justify-between">
              <Link 
                href="/student/dashboard" 
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">🎯</span>
                </div>
                {sidebarOpen && (
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      SchoolEquip
                    </span>
                    <span className="text-xs text-gray-500">Student Portal</span>
                  </div>
                )}
              </Link>
              
              {/* Close button - mobile only */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-xl hover:bg-white/50 transition-all duration-200"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group ${
                    item.current
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-white/60 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    item.current 
                      ? "bg-white/20" 
                      : "bg-gray-100 group-hover:bg-blue-100"
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      item.current ? "text-white" : "text-gray-600 group-hover:text-blue-600"
                    }`} />
                  </div>
                  {sidebarOpen && (
                    <>
                      <span className="font-medium flex-1">{item.name}</span>
                      {item.current && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-6 border-t border-white/60">
            <div className={`flex items-center gap-3 p-3 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/60 ${
              sidebarOpen ? "justify-between" : "justify-center"
            }`}>
              {sidebarOpen ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">Student User</span>
                      <span className="text-xs text-gray-500">Student</span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200 hover:scale-110"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm z-30">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Left section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-xl hover:bg-white/60 transition-all duration-200 lg:hidden"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Link href="/student/dashboard" className="hover:text-blue-600 transition-colors">
                    Dashboard
                  </Link>
                  <ChevronRight className="w-4 h-4" />
                  <span className="text-gray-900 font-medium">
                    {pathname === "/student/dashboard" && "Equipment"}
                    {pathname.startsWith("/student/requests") && "My Requests"}
                  </span>
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search equipment..."
                    className="pl-10 pr-4 py-2 rounded-2xl border border-gray-200 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 w-64"
                  />
                </div>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-xl hover:bg-white/60 transition-all duration-200 relative"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications dropdown */}
                  {notificationsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setNotificationsOpen(false)}
                      />
                      <div className="absolute right-0 top-12 w-80 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-2xl z-50 py-2">
                        <div className="px-4 py-2 border-b border-white/60">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 hover:bg-white/60 transition-colors cursor-pointer border-l-2 ${
                                notification.read 
                                  ? "border-transparent" 
                                  : "border-blue-500 bg-blue-50/50"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className={`font-medium text-sm ${
                                  notification.read ? "text-gray-700" : "text-gray-900"
                                }`}>
                                  {notification.title}
                                </span>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-xs text-gray-600 line-clamp-2">
                                {notification.message}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="px-4 py-2 border-t border-white/60">
                          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center py-2">
                            View all notifications
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/60 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      S
                    </div>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-semibold text-gray-900">Student User</span>
                      <span className="text-xs text-gray-500">Student</span>
                    </div>
                  </button>

                  {/* User dropdown */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-12 w-56 bg-white/90 backdrop-blur-xl rounded-2xl border border-white/60 shadow-2xl z-50 py-2">
                        <div className="px-4 py-3 border-b border-white/60">
                          <p className="text-sm font-semibold text-gray-900">Student User</p>
                          <p className="text-xs text-gray-500">student@school.edu</p>
                        </div>
                        <div className="py-2">
                          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/60 transition-colors">
                            <User className="w-4 h-4" />
                            Profile
                          </button>
                          <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-white/60 transition-colors">
                            <Settings className="w-4 h-4" />
                            Settings
                          </button>
                        </div>
                        <div className="px-4 py-2 border-t border-white/60">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-to-r from-green-200 to-cyan-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  )
}