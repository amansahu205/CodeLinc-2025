"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm FinBuddy, your AI financial wellness assistant. How can I help you today?",
    },
  ])

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, { role: "user", content: message }])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm here to help with your financial questions. This is a demo response!",
        },
      ])
    }, 1000)
  }

  return (
    <>
      {/* Floating chat button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 300 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#a50034] to-[#eed9b7] flex items-center justify-center shadow-2xl z-50 group"
        style={{
          boxShadow: "0 0 40px rgba(165, 0, 52, 0.5), 0 10px 30px rgba(0, 0, 0, 0.2)",
        }}
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          {isOpen ? <X className="w-7 h-7 text-white" /> : <MessageSquare className="w-7 h-7 text-white" />}
        </motion.div>

        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#a50034]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Sparkle effect */}
        <motion.div
          className="absolute -top-1 -right-1 w-6 h-6 bg-[#eed9b7] rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-3 h-3 text-[#a50034]" />
        </motion.div>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-6 w-96 h-[500px] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden glass-card"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)",
              border: "2px solid rgba(165, 0, 52, 0.2)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(165, 0, 52, 0.1)",
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#a50034] to-[#eed9b7] p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white">FinBuddy</h3>
                <p className="text-xs text-white/80">AI Financial Assistant</p>
              </div>
              <motion.div
                className="w-2 h-2 rounded-full bg-[#22c55e]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-[#a50034] to-[#7d1f3c] text-white"
                        : "bg-white/80 text-[#333333] border border-[#e5e4e3]"
                    }`}
                    style={{
                      boxShadow:
                        msg.role === "user" ? "0 4px 15px rgba(165, 0, 52, 0.3)" : "0 2px 10px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#e5e4e3] bg-white/50 backdrop-blur-sm">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/80 border-[#e5e4e3] focus:border-[#a50034]"
                />
                <Button
                  onClick={handleSend}
                  className="bg-gradient-to-r from-[#a50034] to-[#eed9b7] hover:from-[#8a002b] hover:to-[#d9c49f] text-white"
                  style={{
                    boxShadow: "0 4px 15px rgba(165, 0, 52, 0.3)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
