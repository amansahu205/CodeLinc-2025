"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function EnhancedLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const handleSignIn = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")
      setIsLoading(true)

      // Mock validation with delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simple mock validation
      if (email && password.length >= 6) {
        router.push("/dashboard/benefits")
      } else {
        setError("Invalid email or password. Please try again.")
        setIsLoading(false)
      }
    },
    [email, password, router],
  )

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" },
      }

  return (
    <motion.div {...animationProps} className="w-full max-w-md px-4 sm:px-0 relative">
      <div className="absolute -inset-4 bg-gradient-to-r from-[#EED9B7]/40 via-[#A50034]/20 to-[#EED9B7]/40 rounded-3xl blur-2xl animate-pulse" />

      <Card className="relative shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl bg-white/70 rounded-2xl">
        <motion.div
          className="relative bg-gradient-to-r from-[#A50034] to-[#1C2431] px-6 sm:px-8 py-10 text-center overflow-hidden"
          initial={shouldReduceMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {!shouldReduceMotion &&
            [...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: Math.random() * 2,
                }}
              />
            ))}

          <motion.h2
            className="relative text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
            initial={shouldReduceMotion ? {} : { y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p
            className="relative text-base sm:text-lg text-white/90"
            initial={shouldReduceMotion ? {} : { y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your path to financial confidence starts here.
          </motion.p>
        </motion.div>

        <div className="px-6 sm:px-8 md:px-10 py-8 sm:py-10 relative">
          <form onSubmit={handleSignIn} className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={shouldReduceMotion ? {} : { x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Label htmlFor="email" className="text-[#1C2431] font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email Address"
                aria-required="true"
                disabled={isLoading}
                className="h-12 bg-white border-2 border-[#DADADA] rounded-xl text-base placeholder:text-[#1C2431]/50 focus:border-[#A50034] focus:ring-2 focus:ring-[#A50034]/20 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
              />
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={shouldReduceMotion ? {} : { x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#1C2431] font-medium">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-sm text-[#A50034] hover:text-[#8B0029] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A50034] focus:ring-offset-2 rounded"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-label="Password"
                  aria-required="true"
                  disabled={isLoading}
                  className="h-12 bg-white border-2 border-[#DADADA] rounded-xl text-base placeholder:text-[#1C2431]/50 focus:border-[#A50034] focus:ring-2 focus:ring-[#A50034]/20 pr-12 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
                />
                <motion.button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C2431]/60 hover:text-[#A50034] transition-colors focus:outline-none focus:ring-2 focus:ring-[#A50034] rounded disabled:opacity-50"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </div>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                {error}
              </motion.div>
            )}

            <motion.div
              initial={shouldReduceMotion ? {} : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-[#A50034] to-[#1C2431] hover:from-[#8B0029] hover:to-[#151D28] text-white rounded-xl shadow-lg overflow-hidden group transition-all duration-300 disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#A50034] focus:ring-offset-2"
              >
                {isLoading ? (
                  <motion.div className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </motion.div>
                ) : (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#EED9B7]/0 via-[#EED9B7]/20 to-[#EED9B7]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative">Sign In</span>
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}
