"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import StudentLayout from "@/components/layouts/student-layout"
import EquipmentCard from "@/components/equipment-card"
import { Spinner } from "@/components/ui/spinner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface Equipment {
  id: number
  name: string
  category: { name: string }
  description: string
  condition: string
  total_quantity: number
  available_quantity: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/login")
      return
    }

    fetchEquipment()
  }, [router])

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("access_token")
      let url = `${API_URL}/api/equipment/?available=true`

      if (searchTerm) url += `&search=${searchTerm}`
      if (selectedCategory) url += `&category=${selectedCategory}`

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setEquipment(data.results || data)
      }
    } catch (error) {
      console.error("Failed to fetch equipment:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEquipment()
  }, [searchTerm, selectedCategory])

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Available Equipment</h1>
          <p className="text-muted-foreground">Browse and request equipment for your projects</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
          >
            <option value="">All Categories</option>
            <option value="1">Photography Equipment</option>
            <option value="2">Sports Equipment</option>
            <option value="3">Lab Equipment</option>
            <option value="4">Musical Instruments</option>
            <option value="5">Project Materials</option>
          </select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.length > 0 ? (
              equipment.map((item) => <EquipmentCard key={item.id} equipment={item} isStudent={true} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No equipment found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}
