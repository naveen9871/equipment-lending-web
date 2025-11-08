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
      if (role === "admin" || role === "staff") {
        router.push("/admin/dashboard")
      } else {
        router.push("/student/dashboard")
      }
    } else {
      setIsChecking(false)
    }
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-foreground mb-4">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <nav className="border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">SchoolEquip</div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Streamline Your School Equipment Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Efficiently manage borrowing requests, track equipment usage, and prevent scheduling conflicts with our
            intelligent equipment lending system.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition text-lg"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-background border border-border hover:border-primary transition">
            <div className="text-3xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Equipment Management</h3>
            <p className="text-muted-foreground">
              Track all items with category, condition, quantity, and availability status in real-time.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-background border border-border hover:border-primary transition">
            <div className="text-3xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Smart Approvals</h3>
            <p className="text-muted-foreground">
              Staff can approve or reject requests with automatic conflict detection to prevent overlapping bookings.
            </p>
          </div>
          <div className="p-6 rounded-xl bg-background border border-border hover:border-primary transition">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-foreground mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground">
              Monitor usage patterns, availability rates, and get insights into equipment demand.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
