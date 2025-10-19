"use client"

import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, X, Send, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AIChatWidgetProps {
  onRecommendations?: (recommendations: string[]) => void
}

export function AIChatWidget({ onRecommendations }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm FinBuddy, your AI financial wellness assistant. How can I help you today?",
    },
  ])

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message
    setMessages([...messages, { role: "user", content: userMessage }])
    setMessage("")
    setIsLoading(true)

    try {
      const { api } = await import('@/lib/api')
      const { auth } = await import('@/lib/auth')
      const token = auth.getToken()
      
      if (!token) return

      const data = await api.chat(token, userMessage)
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ])

      if (data.recommendations && onRecommendations) {
        onRecommendations(data.recommendations)
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again." }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <aside className="w-96 bg-white/70 backdrop-blur-xl border-l border-white/40 shadow-lg flex flex-col">
      <div className="flex flex-col h-full">
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
      </div>
    </aside>
  )
}
