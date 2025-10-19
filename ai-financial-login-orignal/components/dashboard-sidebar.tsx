"use client"

import { motion } from "framer-motion"
import { Home, MessageSquare, Wrench, BookOpen, Settings } from "lucide-react"
import { useState } from "react"

const navItems = [
  { icon: Home, label: "Home", active: true },
  { icon: MessageSquare, label: "Chat", active: false },
  { icon: Wrench, label: "Tools", active: false },
  { icon: BookOpen, label: "Learning", active: false },
  { icon: Settings, label: "Settings", active: false },
]

export function DashboardSidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      className="w-20 lg:w-24 backdrop-blur-xl bg-white/40 border-r border-white/30 flex flex-col items-center py-8 gap-6 relative z-20 glass-card"
    >
      {navItems.map((item, index) => {
        const Icon = item.icon
        const isHovered = hoveredIndex === index

        return (
          <motion.button
            key={item.label}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
              item.active
                ? "bg-gradient-to-br from-[#a50034] to-[#7d1f3c] text-white shadow-lg"
                : "bg-white/60 text-[#666666] hover:bg-white/80"
            }`}
            style={{
              boxShadow: item.active
                ? "0 0 30px rgba(165, 0, 52, 0.4), 0 10px 20px rgba(0, 0, 0, 0.1)"
                : isHovered
                  ? "0 0 20px rgba(238, 217, 183, 0.6), 0 5px 15px rgba(0, 0, 0, 0.1)"
                  : "0 2px 8px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Icon className="w-6 h-6" />

            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute left-full ml-4 px-3 py-2 bg-[#333333] text-white text-sm rounded-lg whitespace-nowrap shadow-lg"
              >
                {item.label}
              </motion.div>
            )}
          </motion.button>
        )
      })}
    </motion.aside>
  )
}
