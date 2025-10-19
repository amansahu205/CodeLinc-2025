"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ChatIconPlaceholder() {
  const [isOpen, setIsOpen] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  return (
    <>
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={shouldReduceMotion ? {} : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, type: "spring" }}
      >
        <div className="relative group">
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-[#1C2431] text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Chat with Wellness Assistant
            <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-[#1C2431]" />
          </div>

          <Button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-[#A50034] to-[#EED9B7] hover:from-[#8B0029] hover:to-[#D4C4A0] shadow-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#A50034] focus:ring-offset-2"
            aria-label="Open chat with wellness assistant"
          >
            <motion.div animate={shouldReduceMotion ? {} : { rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
              {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
            </motion.div>
          </Button>

          {/* Pulsing ring effect */}
          {!shouldReduceMotion && !isOpen && (
            <motion.div
              className="absolute inset-0 rounded-full bg-[#A50034]/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
      </motion.div>

      {isOpen && (
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-40 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#A50034] to-[#1C2431] p-4 text-white">
            <h3 className="font-semibold text-lg">Wellness Assistant</h3>
            <p className="text-sm text-white/80">Coming soon - Amazon Lex integration</p>
          </div>
          <div className="p-4 h-full flex items-center justify-center text-[#1C2431]/60">
            <p className="text-center">Chat functionality will be available soon</p>
          </div>
        </motion.div>
      )}
    </>
  )
}
