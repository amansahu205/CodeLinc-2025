"use client"

import { motion } from "framer-motion"
import { TrendingUp, Activity } from "lucide-react"
import { useEffect, useState } from "react"

export function FinancialHealthScore() {
  const [score, setScore] = useState(0)
  const targetScore = 78

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScore((prev) => {
          if (prev >= targetScore) {
            clearInterval(interval)
            return targetScore
          }
          return prev + 1
        })
      }, 20)
      return () => clearInterval(interval)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"
    if (score >= 60) return "#eed9b7"
    return "#a50034"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Attention"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative group"
    >
      <div
        className="glass-card rounded-2xl p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
          border: "2px solid transparent",
          backgroundClip: "padding-box",
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(165, 0, 52, 0.1)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${getScoreColor(score)}40 0%, transparent 70%)`,
            filter: "blur(30px)",
            zIndex: -1,
          }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#a50034] to-[#eed9b7] flex items-center justify-center shadow-lg"
              style={{
                boxShadow: "0 0 30px rgba(165, 0, 52, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#333333]">Financial Health Score</h2>
              <p className="text-sm text-[#666666]">Your overall financial wellness rating</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Circular score meter */}
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e4e3" strokeWidth="12" fill="none" />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={getScoreColor(score)}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 351.68" }}
                  animate={{ strokeDasharray: `${(score / 100) * 351.68} 351.68` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  style={{
                    filter: `drop-shadow(0 0 8px ${getScoreColor(score)}80)`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-4xl font-bold"
                  style={{ color: getScoreColor(score) }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {score}
                </motion.span>
                <span className="text-xs text-[#666666]">out of 100</span>
              </div>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border-2 shadow-lg mb-2"
                style={{
                  borderColor: getScoreColor(score),
                  boxShadow: `0 0 20px ${getScoreColor(score)}40`,
                }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: getScoreColor(score) }} />
                <span className="font-bold text-sm" style={{ color: getScoreColor(score) }}>
                  {getScoreLabel(score)}
                </span>
              </motion.div>
              <p className="text-xs text-[#666666]">+7 points this month</p>
            </div>
          </div>
        </div>

        {/* Progress indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#e5e4e3]">
          <div className="text-center">
            <p className="text-xs text-[#666666] mb-1">Savings</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <div className="w-2 h-2 rounded-full bg-[#e5e4e3]" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#666666] mb-1">Debt</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#eed9b7]" />
              <div className="w-2 h-2 rounded-full bg-[#eed9b7]" />
              <div className="w-2 h-2 rounded-full bg-[#e5e4e3]" />
              <div className="w-2 h-2 rounded-full bg-[#e5e4e3]" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#666666] mb-1">Investments</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#666666] mb-1">Planning</p>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#eed9b7]" />
              <div className="w-2 h-2 rounded-full bg-[#eed9b7]" />
              <div className="w-2 h-2 rounded-full bg-[#eed9b7]" />
              <div className="w-2 h-2 rounded-full bg-[#e5e4e3]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
