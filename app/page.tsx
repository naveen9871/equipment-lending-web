"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    const role = localStorage.getItem("user_role")

    if (token) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        if (role === "admin" || role === "staff") {
          router.push("/admin/dashboard")
        } else {
          router.push("/student/dashboard")
        }
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700">Getting things ready...</div>
          <p className="text-gray-500 mt-2">Redirecting you to your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SE</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SchoolEquip
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 border border-gray-300 hover:border-gray-400"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="text-center mb-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Equipment Management
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Transform how your school manages equipment lending. Streamline requests, prevent conflicts, 
              and gain valuable insights—all in one intuitive platform designed for educational institutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg min-w-[200px]"
              >
                Start Your Journey
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-lg min-w-[200px]"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📦</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Inventory Tracking</h3>
            <p className="text-gray-600 leading-relaxed">
              Real-time visibility into all equipment with detailed status, condition tracking, 
              and automated availability updates across your entire institution.
            </p>
          </div>
          
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">✅</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Intelligent Approvals</h3>
            <p className="text-gray-600 leading-relaxed">
              Smart conflict detection and streamlined approval workflows ensure fair access 
              while preventing scheduling overlaps and equipment conflicts.
            </p>
          </div>
          
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Actionable Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Comprehensive analytics and usage reports help you make data-driven decisions 
              about equipment purchases, maintenance, and resource allocation.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Equipment Management?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of schools already streamlining their equipment lending process 
            and providing better resources for their students and staff.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Your Account Today
            <span className="ml-2">→</span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">SE</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">SchoolEquip</span>
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 SchoolEquip. Empowering educational institutions worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}