"use client"

import { motion } from "framer-motion"

export function BenefitsProfileBar() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#a50034] to-[#7d1f3c] flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-lg flex-shrink-0">
            JD
          </div>
          <div className="flex-1">
            <h2 className="text-base sm:text-lg font-semibold text-[#333333]">John Doe</h2>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#666666]">
              <span>Age: 24</span>
              <span className="hidden sm:inline">•</span>
              <span>Salary: $62,000</span>
              <span className="hidden sm:inline">•</span>
              <span>Dependents: 0</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
