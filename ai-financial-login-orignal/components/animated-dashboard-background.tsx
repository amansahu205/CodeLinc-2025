"use client"
import { useEffect, useState } from "react"

export function AnimatedDashboardBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #f7f6f5 0%, #eed9b7 50%, #f4d4c8 100%)",
        }}
      />

      <div
        className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-5"
        style={{
          background: "#a50034",
        }}
      />
      <div
        className="absolute bottom-32 left-32 w-80 h-80 rounded-full opacity-5"
        style={{
          background: "#eed9b7",
        }}
      />
    </div>
  )
}
