"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PiggyBank, GraduationCap, Calculator, BookOpen, TrendingUp, Shield, DollarSign } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
}

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Emergency Savings Card */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group"
      >
        <div
          className="glass-card rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(165, 0, 52, 0.1)",
          }}
        >
          {/* Golden rim glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #eed9b7 0%, #a50034 100%)",
              filter: "blur(20px)",
              transform: "translateZ(-10px)",
              zIndex: -1,
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#eed9b7] to-transparent opacity-0 group-hover:opacity-100"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a50034] to-[#7d1f3c] flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              style={{
                boxShadow: "0 0 30px rgba(165, 0, 52, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <PiggyBank className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#666666] font-medium">Candidly</p>
              <p className="text-xs text-[#999999]">Emergency Fund</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#333333] mb-2">Emergency Savings</h3>
          <p className="text-sm text-[#666666] mb-6">Build your financial safety net</p>

          {/* Circular progress */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e4e3" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="url(#gradient1)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 251.2" }}
                  animate={{ strokeDasharray: "100.48 251.2" }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a50034" />
                    <stop offset="100%" stopColor="#eed9b7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-[#a50034]">40%</span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#333333]">$400</p>
              <p className="text-sm text-[#666666]">of $1,000 goal</p>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#a50034] to-[#7d1f3c] hover:from-[#8a002b] hover:to-[#6a1a33] text-white shadow-lg group-hover:shadow-2xl transition-all duration-300"
            style={{
              boxShadow: "0 4px 20px rgba(165, 0, 52, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Grow Savings
          </Button>
        </div>
      </motion.div>

      {/* 529 College Savings Card */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group"
      >
        <div
          className="glass-card rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(28, 36, 49, 0.1)",
          }}
        >
          {/* Golden rim glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #1c2431 0%, #eed9b7 100%)",
              filter: "blur(20px)",
              transform: "translateZ(-10px)",
              zIndex: -1,
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#eed9b7] to-transparent opacity-0 group-hover:opacity-100"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1c2431] to-[#a50034] flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              style={{
                boxShadow: "0 0 30px rgba(28, 36, 49, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#666666] font-medium">Education</p>
              <p className="text-xs text-[#999999]">529 Plan</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#333333] mb-2">529 College Savings</h3>
          <p className="text-sm text-[#666666] mb-6">Invest in your child's future education</p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666666]">Current Balance</span>
              <span className="font-bold text-[#333333]">$12,450</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666666]">Monthly Contribution</span>
              <span className="font-bold text-[#333333]">$250</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666666]">Projected at Age 18</span>
              <span className="font-bold text-[#a50034]">$85,000</span>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#1c2431] to-[#a50034] hover:from-[#151d28] hover:to-[#8a002b] text-white shadow-lg group-hover:shadow-2xl transition-all duration-300"
            style={{
              boxShadow: "0 4px 20px rgba(28, 36, 49, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Explore Plan Options
          </Button>
        </div>
      </motion.div>

      {/* Financial Calculators Card */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group"
      >
        <div
          className="glass-card rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(165, 0, 52, 0.1)",
          }}
        >
          {/* Golden rim glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #a50034 0%, #eed9b7 100%)",
              filter: "blur(20px)",
              transform: "translateZ(-10px)",
              zIndex: -1,
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#eed9b7] to-transparent opacity-0 group-hover:opacity-100"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#a50034] to-[#eed9b7] flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              style={{
                boxShadow: "0 0 30px rgba(165, 0, 52, 0.4), inset 0 2px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#666666] font-medium">Tools</p>
              <p className="text-xs text-[#999999]">WellnessPATH</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#333333] mb-2">Financial Calculators</h3>
          <p className="text-sm text-[#666666] mb-6">Plan your financial future with precision</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#a50034] transition-colors duration-300 text-left"
            >
              <TrendingUp className="w-5 h-5 text-[#a50034] mb-2" />
              <p className="text-xs font-semibold text-[#333333]">Retirement</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#a50034] transition-colors duration-300 text-left"
            >
              <Shield className="w-5 h-5 text-[#a50034] mb-2" />
              <p className="text-xs font-semibold text-[#333333]">Insurance</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#a50034] transition-colors duration-300 text-left"
            >
              <DollarSign className="w-5 h-5 text-[#a50034] mb-2" />
              <p className="text-xs font-semibold text-[#333333]">Debt</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#a50034] transition-colors duration-300 text-left"
            >
              <Calculator className="w-5 h-5 text-[#a50034] mb-2" />
              <p className="text-xs font-semibold text-[#333333]">More Tools</p>
            </motion.button>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#a50034] to-[#eed9b7] hover:from-[#8a002b] hover:to-[#d9c49f] text-white shadow-lg group-hover:shadow-2xl transition-all duration-300"
            style={{
              boxShadow: "0 4px 20px rgba(165, 0, 52, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <Calculator className="w-4 h-4 mr-2" />
            View All Calculators
          </Button>
        </div>
      </motion.div>

      {/* Learning Hub Card */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        whileHover={{ scale: 1.02, y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group"
      >
        <div
          className="glass-card rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(238, 217, 183, 0.3)",
          }}
        >
          {/* Golden rim glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: "linear-gradient(135deg, #eed9b7 0%, #a50034 100%)",
              filter: "blur(20px)",
              transform: "translateZ(-10px)",
              zIndex: -1,
            }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#eed9b7] to-transparent opacity-0 group-hover:opacity-100"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#eed9b7] to-[#a50034] flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
              style={{
                boxShadow: "0 0 30px rgba(238, 217, 183, 0.6), inset 0 2px 10px rgba(255, 255, 255, 0.2)",
              }}
            >
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-right">
              <p className="text-sm text-[#666666] font-medium">Education</p>
              <p className="text-xs text-[#999999]">Learning Hub</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-[#333333] mb-2">Learning Hub</h3>
          <p className="text-sm text-[#666666] mb-6">Master your financial wellness journey</p>

          <div className="space-y-3 mb-6">
            <motion.div
              whileHover={{ x: 5 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#eed9b7] transition-all duration-300 cursor-pointer"
            >
              <p className="text-sm font-semibold text-[#333333] mb-1">Budgeting 101</p>
              <p className="text-xs text-[#666666]">Learn the basics of budgeting</p>
              <Progress value={75} className="mt-2 h-1" />
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#eed9b7] transition-all duration-300 cursor-pointer"
            >
              <p className="text-sm font-semibold text-[#333333] mb-1">Investing Basics</p>
              <p className="text-xs text-[#666666]">Start your investment journey</p>
              <Progress value={30} className="mt-2 h-1" />
            </motion.div>
            <motion.div
              whileHover={{ x: 5 }}
              className="p-3 rounded-lg bg-white/80 border border-[#e5e4e3] hover:border-[#eed9b7] transition-all duration-300 cursor-pointer"
            >
              <p className="text-sm font-semibold text-[#333333] mb-1">Debt Management</p>
              <p className="text-xs text-[#666666]">Strategies to reduce debt</p>
              <Progress value={0} className="mt-2 h-1" />
            </motion.div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-[#eed9b7] to-[#a50034] hover:from-[#d9c49f] hover:to-[#8a002b] text-white shadow-lg group-hover:shadow-2xl transition-all duration-300"
            style={{
              boxShadow: "0 4px 20px rgba(238, 217, 183, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
            }}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Explore All Courses
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
