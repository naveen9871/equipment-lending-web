"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

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

export default function EquipmentCard({ equipment, isStudent }: { equipment: Equipment; isStudent?: boolean }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 1,
    purpose: "",
    borrow_from: "",
    borrow_until: "",
  })
  const [loading, setLoading] = useState(false)

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`${API_URL}/api/requests/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipment: equipment.id,
          quantity: Number.parseInt(formData.quantity.toString()),
          purpose: formData.purpose,
          borrow_from: new Date(formData.borrow_from).toISOString(),
          borrow_until: new Date(formData.borrow_until).toISOString(),
        }),
      })

      if (response.ok) {
        setShowModal(false)
        alert("Request submitted successfully!")
        router.push("/student/requests")
      } else {
        alert("Failed to submit request")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error submitting request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="p-6 rounded-lg border border-border bg-background hover:border-primary transition">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-foreground mb-1">{equipment.name}</h3>
          <p className="text-sm text-muted-foreground">{equipment.category.name}</p>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{equipment.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground">Condition</p>
            <p className="text-foreground font-medium capitalize">{equipment.condition}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available</p>
            <p className="text-foreground font-medium">
              {equipment.available_quantity}/{equipment.total_quantity}
            </p>
          </div>
        </div>

        {isStudent && (
          <button
            onClick={() => setShowModal(true)}
            disabled={equipment.available_quantity === 0}
            className="w-full py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {equipment.available_quantity > 0 ? "Request to Borrow" : "Not Available"}
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg border border-border p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-4">Request: {equipment.name}</h2>

            <form onSubmit={handleBorrow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={equipment.available_quantity}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Purpose</label>
                <textarea
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary resize-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Borrow From</label>
                <input
                  type="datetime-local"
                  value={formData.borrow_from}
                  onChange={(e) => setFormData({ ...formData, borrow_from: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Borrow Until</label>
                <input
                  type="datetime-local"
                  value={formData.borrow_until}
                  onChange={(e) => setFormData({ ...formData, borrow_until: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
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
    </>
  )
}
