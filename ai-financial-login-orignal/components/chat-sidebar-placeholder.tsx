"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Send, Sparkles, X, MessageCircle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  hasLearnMore?: boolean
}

interface ChatSidebarPlaceholderProps {
  onCompareHealthPlans?: () => void
  onShowTotalCost?: () => void
}

export function ChatSidebarPlaceholder({
  onCompareHealthPlans = () => {},
  onShowTotalCost = () => {},
}: ChatSidebarPlaceholderProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hi there! I'm your AI Wellness Assistant. How can I help you understand your benefits today?",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSendMessage = () => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setMessage("")
    setIsTyping(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: getMockResponse(message),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    if (lowerInput.includes("ltd") || lowerInput.includes("disability")) {
      return "Long-Term Disability (LTD) helps safeguard your income in case of long-term injury or illness. It typically covers 60% of your salary after a waiting period. Would you like to know more about the coverage details?"
    }
    if (lowerInput.includes("health") || lowerInput.includes("medical")) {
      return "Health insurance helps cover medical expenses including doctor visits, hospital stays, and prescriptions. Based on your profile, I recommend the Standard Plan which offers comprehensive coverage at $30.50 per paycheck."
    }
    if (lowerInput.includes("cost") || lowerInput.includes("total")) {
      return "Based on your current selections, your total benefits cost is $45.50 per paycheck. This includes Health, Dental, Vision, and Life Insurance. Would you like to adjust any of these?"
    }
    return "I'd be happy to help you with that! Could you provide more details about what you'd like to know regarding your benefits?"
  }

  const handleQuickAction = (action: string) => {
    if (action === "Compare Health Plans") {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: action,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      onCompareHealthPlans()
      setIsTyping(true)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "I've opened the plan comparison for you! You can see the HDHP, PPO, and HMO options side-by-side. The HDHP is our top pick for your profile.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 800)
    } else if (action === "Explain STD Coverage") {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: action,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "Short-Term Disability covers 60–70% of your income for up to 12 weeks if you're unable to work due to maternity leave or illness.",
          timestamp: new Date(),
          hasLearnMore: true,
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 1500)
    } else if (action === "Show Total Cost") {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: "user",
        content: action,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      onShowTotalCost()
      setIsTyping(true)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "I've scrolled to your total cost summary at the bottom. Your current total is $45.50 per paycheck, which includes all your selected benefits.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsTyping(false)
      }, 800)
    }
  }

  const quickActions = ["Compare Health Plans", "Explain STD Coverage", "Show Total Cost"]

  const sidebarVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.3 },
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.4 },
    },
  }

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.4,
        delay: shouldReduceMotion ? 0 : i * 0.1,
      },
    }),
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-28 right-6 lg:hidden w-14 h-14 bg-gradient-to-br from-[#A50034] to-[#8B0028] rounded-full shadow-lg flex items-center justify-center z-50"
            aria-label="Open chat assistant"
          >
            <MessageCircle className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#EED9B7] rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.aside
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-8 top-24 bottom-32 w-full sm:w-[420px] lg:w-[450px] flex flex-col backdrop-blur-[8px] bg-white/70 shadow-2xl rounded-[24px] z-50 border border-white/30 overflow-hidden"
            style={{
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
            }}
          >
            <div
              className="relative px-6 py-5 border-b border-white/10"
              style={{
                background: "linear-gradient(135deg, #A50034 0%, #5A001C 100%)",
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#EED9B7] rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">AI Wellness Assistant</h2>
                    <p className="text-white/80 text-sm">Your 24/7 benefits guide</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden text-white/80 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 relative"
              style={{
                background: "linear-gradient(to bottom, rgba(247, 246, 245, 0.5), rgba(255, 255, 255, 0.5))",
                scrollBehavior: "smooth",
              }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  custom={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex gap-3 ${msg.type === "user" ? "justify-end" : ""}`}
                >
                  {msg.type === "assistant" && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A50034] to-[#8B0028] flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                  )}
                  <div className={`flex-1 ${msg.type === "user" ? "flex justify-end" : ""}`}>
                    <div
                      className={`rounded-2xl p-4 shadow-md max-w-[85%] ${
                        msg.type === "assistant"
                          ? "bg-gradient-to-br from-[#A50034] to-[#C91F4D] text-white"
                          : "bg-[#F7F6F5] border-2 border-[#EED9B7] text-[#1C2431]"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.hasLearnMore && (
                        <motion.button
                          onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                          className="mt-3 text-xs font-semibold underline hover:no-underline transition-all"
                          whileHover={{ scale: 1.05 }}
                        >
                          {expandedMessageId === msg.id ? "Show less" : "Learn more"}
                        </motion.button>
                      )}
                      <AnimatePresence>
                        {expandedMessageId === msg.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 pt-3 border-t border-white/30 text-xs space-y-2 overflow-hidden"
                          >
                            <p>
                              <strong>Waiting Period:</strong> Typically 7-14 days
                            </p>
                            <p>
                              <strong>Coverage Duration:</strong> Up to 12 weeks
                            </p>
                            <p>
                              <strong>Common Uses:</strong> Maternity leave, surgery recovery, illness
                            </p>
                            <p>
                              <strong>Cost:</strong> $230 per paycheck
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A50034] to-[#8B0028] flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <div className="bg-gradient-to-br from-[#A50034] to-[#C91F4D] rounded-2xl px-5 py-3 shadow-md">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-[#EED9B7]"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <motion.button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    whileHover={{
                      scale: shouldReduceMotion ? 1 : 1.05,
                      boxShadow: "0 4px 12px rgba(165, 0, 52, 0.2)",
                    }}
                    whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                    className="px-3 py-1.5 bg-gradient-to-r from-[#EED9B7] to-[#E5D0A8] text-[#1C2431] text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-in-out border border-[#EED9B7]/50"
                  >
                    {action}
                  </motion.button>
                ))}
              </div>
            </div>

            <div
              className="m-4 bg-white rounded-[24px] p-3 shadow-lg"
              style={{
                boxShadow: "0 -4px 12px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  placeholder="Ask your benefits assistant…"
                  className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-[#1C2431] placeholder:text-gray-400"
                  aria-label="Ask your benefits assistant"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  size="icon"
                  className="bg-gradient-to-br from-[#A50034] to-[#8B0028] hover:from-[#8B0028] hover:to-[#A50034] text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 w-10"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className="px-4 py-2 bg-gradient-to-r from-[#F7F6F5]/80 to-white/80 backdrop-blur-sm border-t border-gray-200/50"
              style={{
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
              }}
            >
              <p className="text-xs text-gray-600 text-center">
                Powered by <span className="font-semibold text-[#1C2431]">Amazon Lex</span>
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile modal overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="fixed right-4 top-20 bottom-28 w-[calc(100%-2rem)] max-w-[420px] flex flex-col backdrop-blur-[8px] bg-white/70 shadow-2xl rounded-[24px] z-50 border border-white/30 overflow-hidden"
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)",
              }}
            >
              <div
                className="relative px-6 py-5 border-b border-white/10"
                style={{
                  background: "linear-gradient(135deg, #A50034 0%, #5A001C 100%)",
                  borderTopLeftRadius: "24px",
                  borderTopRightRadius: "24px",
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/30">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#EED9B7] rounded-full border-2 border-white animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">AI Wellness Assistant</h2>
                      <p className="text-white/80 text-sm">Your 24/7 benefits guide</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 relative"
                style={{
                  background: "linear-gradient(to bottom, rgba(247, 246, 245, 0.5), rgba(255, 255, 255, 0.5))",
                  scrollBehavior: "smooth",
                }}
              >
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    custom={index}
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    className={`flex gap-3 ${msg.type === "user" ? "justify-end" : ""}`}
                  >
                    {msg.type === "assistant" && (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A50034] to-[#8B0028] flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white text-xs font-bold">AI</span>
                      </div>
                    )}
                    <div className={`flex-1 ${msg.type === "user" ? "flex justify-end" : ""}`}>
                      <div
                        className={`rounded-2xl p-4 shadow-md max-w-[85%] ${
                          msg.type === "assistant"
                            ? "bg-gradient-to-br from-[#A50034] to-[#C91F4D] text-white"
                            : "bg-[#F7F6F5] border-2 border-[#EED9B7] text-[#1C2431]"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        {msg.hasLearnMore && (
                          <motion.button
                            onClick={() => setExpandedMessageId(expandedMessageId === msg.id ? null : msg.id)}
                            className="mt-3 text-xs font-semibold underline hover:no-underline transition-all"
                            whileHover={{ scale: 1.05 }}
                          >
                            {expandedMessageId === msg.id ? "Show less" : "Learn more"}
                          </motion.button>
                        )}
                        <AnimatePresence>
                          {expandedMessageId === msg.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="mt-3 pt-3 border-t border-white/30 text-xs space-y-2 overflow-hidden"
                            >
                              <p>
                                <strong>Waiting Period:</strong> Typically 7-14 days
                              </p>
                              <p>
                                <strong>Coverage Duration:</strong> Up to 12 weeks
                              </p>
                              <p>
                                <strong>Common Uses:</strong> Maternity leave, surgery recovery, illness
                              </p>
                              <p>
                                <strong>Cost:</strong> $230 per paycheck
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#A50034] to-[#8B0028] flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <div className="bg-gradient-to-br from-[#A50034] to-[#C91F4D] rounded-2xl px-5 py-3 shadow-md">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-[#EED9B7]"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="px-4 py-2 bg-white/50 backdrop-blur-sm border-t border-gray-200/50">
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((action) => (
                    <motion.button
                      key={action}
                      onClick={() => handleQuickAction(action)}
                      whileHover={{
                        scale: shouldReduceMotion ? 1 : 1.05,
                        boxShadow: "0 4px 12px rgba(165, 0, 52, 0.2)",
                      }}
                      whileTap={{ scale: shouldReduceMotion ? 1 : 0.95 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-[#EED9B7] to-[#E5D0A8] text-[#1C2431] text-xs font-medium rounded-full shadow-sm hover:shadow-md transition-all duration-300 ease-in-out border border-[#EED9B7]/50"
                    >
                      {action}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div
                className="m-4 bg-white rounded-[24px] p-3 shadow-lg"
                style={{
                  boxShadow: "0 -4px 12px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)",
                }}
              >
                <div className="flex gap-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Ask your benefits assistant…"
                    className="flex-1 bg-transparent border-none focus:ring-0 focus-visible:ring-0 text-[#1C2431] placeholder:text-gray-400"
                    aria-label="Ask your benefits assistant"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    size="icon"
                    className="bg-gradient-to-br from-[#A50034] to-[#8B0028] hover:from-[#8B0028] hover:to-[#A50034] text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed rounded-full h-10 w-10"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div
                className="px-4 py-2 bg-gradient-to-r from-[#F7F6F5]/80 to-white/80 backdrop-blur-sm border-t border-gray-200/50"
                style={{
                  borderBottomLeftRadius: "24px",
                  borderBottomRightRadius: "24px",
                }}
              >
                <p className="text-xs text-gray-600 text-center">
                  Powered by <span className="font-semibold text-[#1C2431]">Amazon Lex</span>
                </p>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
