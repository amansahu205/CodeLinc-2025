"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sign in attempted with:", { email, password })
    router.push("/dashboard/benefits")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-2xl relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-[#eed9b7]/40 via-[#a50034]/20 to-[#eed9b7]/40 rounded-3xl blur-2xl" />

      <Card className="relative shadow-2xl border border-white/30 overflow-hidden backdrop-blur-xl bg-white/85">
        <motion.div
          className="relative bg-gradient-to-r from-[#1a2332] via-[#3d2832] to-[#6b2d3d] px-8 py-12 text-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}

          <motion.h1
            className="relative text-4xl md:text-5xl font-bold text-white mb-3"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Lincoln Wellness Assistant
          </motion.h1>
          <motion.p
            className="relative text-lg md:text-xl text-white/90"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your path to financial confidence starts here.
          </motion.p>
        </motion.div>

        <div className="px-8 md:px-16 py-12 relative">
          <form onSubmit={handleSignIn} className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-14 bg-white/90 border-2 border-[#8b7355]/30 rounded-xl text-base placeholder:text-[#8b7355] focus:border-[#a50034] focus:ring-0 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </motion.div>

            <motion.div
              className="space-y-2 relative"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-14 bg-white/90 border-2 border-[#8b7355]/30 rounded-xl text-base placeholder:text-[#8b7355] focus:border-[#a50034] focus:ring-0 pr-12 transition-all duration-300 shadow-sm hover:shadow-md"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8b7355] hover:text-[#a50034] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            </motion.div>

            <motion.div
              className="relative py-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-[#d4a574]/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/85 px-4 text-lg font-medium text-[#8b7355]">OR</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Button
                type="submit"
                className="relative w-full h-14 text-lg font-semibold bg-gradient-to-r from-[#a50034] to-[#7d1f3c] hover:from-[#8b0029] hover:to-[#6b1a33] text-white rounded-xl shadow-lg overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#eed9b7]/0 via-[#eed9b7]/20 to-[#eed9b7]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative">Sign in</span>
              </Button>
            </motion.div>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}
