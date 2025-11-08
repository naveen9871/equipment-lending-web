"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/layouts/admin-layout"
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
  is_active: boolean
}

export default function AdminEquipment() {
  const router = useRouter()
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "1",
    description: "",
    condition: "excellent",
    total_quantity: 1,
  })

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
      const response = await fetch(`${API_URL}/api/equipment/`, {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("access_token")

    try {
      const url = editingId ? `${API_URL}/api/equipment/${editingId}/` : `${API_URL}/api/equipment/`
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowModal(false)
        setEditingId(null)
        setFormData({ name: "", category: "1", description: "", condition: "excellent", total_quantity: 1 })
        fetchEquipment()
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleEdit = (item: Equipment) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      category: item.category.name === "Photography Equipment" ? "1" : "2",
      description: item.description,
      condition: item.condition,
      total_quantity: item.total_quantity,
    })
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Equipment Management</h1>
            <p className="text-muted-foreground">Add, edit, or manage school equipment</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: "", category: "1", description: "", condition: "excellent", total_quantity: 1 })
              setShowModal(true)
            }}
            className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
          >
            Add Equipment
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-foreground font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-foreground font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-foreground font-semibold">Condition</th>
                  <th className="px-6 py-3 text-left text-foreground font-semibold">Quantity</th>
                  <th className="px-6 py-3 text-left text-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-secondary transition">
                    <td className="px-6 py-3 text-foreground">{item.name}</td>
                    <td className="px-6 py-3 text-muted-foreground">{item.category.name}</td>
                    <td className="px-6 py-3 capitalize text-muted-foreground">{item.condition}</td>
                    <td className="px-6 py-3 text-muted-foreground">{item.total_quantity}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 rounded bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg border border-border p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {editingId ? "Edit Equipment" : "Add Equipment"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={formData.total_quantity}
                  onChange={(e) => setFormData({ ...formData, total_quantity: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition"
                >
                  {editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-secondary transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
