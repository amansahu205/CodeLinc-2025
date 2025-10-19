"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const initialParticles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }
    setParticles(initialParticles)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw 3D geometric mesh lines
      ctx.strokeStyle = "rgba(165, 0, 52, 0.08)"
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        const y = (canvas.height / 5) * i + Math.sin(Date.now() / 1000 + i) * 20
        ctx.beginPath()
        ctx.moveTo(0, y)
        for (let x = 0; x < canvas.width; x += 50) {
          const wave = Math.sin((x + Date.now()) / 200) * 10
          ctx.lineTo(x, y + wave)
        }
        ctx.stroke()
      }

      // Draw and update particles
      setParticles((prevParticles) => {
        return prevParticles.map((particle) => {
          // Update position
          let newX = particle.x + particle.speedX
          let newY = particle.y + particle.speedY

          // Bounce off edges
          if (newX < 0 || newX > canvas.width) particle.speedX *= -1
          if (newY < 0 || newY > canvas.height) particle.speedY *= -1

          newX = Math.max(0, Math.min(canvas.width, newX))
          newY = Math.max(0, Math.min(canvas.height, newY))

          // Draw particle with glow
          const gradient = ctx.createRadialGradient(newX, newY, 0, newX, newY, particle.size * 3)
          gradient.addColorStop(0, `rgba(238, 217, 183, ${particle.opacity})`)
          gradient.addColorStop(0.5, `rgba(238, 217, 183, ${particle.opacity * 0.5})`)
          gradient.addColorStop(1, "rgba(238, 217, 183, 0)")

          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.arc(newX, newY, particle.size * 3, 0, Math.PI * 2)
          ctx.fill()

          return { ...particle, x: newX, y: newY }
        })
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-[#e8d5b7] via-[#f0e4d0] to-[#d4b896]"
        animate={{
          background: [
            "linear-gradient(135deg, #e8d5b7 0%, #f0e4d0 50%, #d4b896 100%)",
            "linear-gradient(135deg, #f0e4d0 0%, #d4b896 50%, #e8d5b7 100%)",
            "linear-gradient(135deg, #d4b896 0%, #e8d5b7 50%, #f0e4d0 100%)",
            "linear-gradient(135deg, #e8d5b7 0%, #f0e4d0 50%, #d4b896 100%)",
          ],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-[#eed9b7]/30 to-transparent blur-3xl"
            style={{
              width: Math.random() * 300 + 200,
              height: Math.random() * 300 + 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-radial from-[#eed9b7]/20 to-transparent blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-radial from-[#a50034]/10 to-transparent blur-3xl pointer-events-none" />
    </>
  )
}
