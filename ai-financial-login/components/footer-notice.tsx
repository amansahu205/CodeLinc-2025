"use client"

import { motion } from "framer-motion"

export function FooterNotice() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="w-full text-center py-6 text-sm text-[#1C2431]/70 backdrop-blur-sm bg-white/20 relative z-10"
    >
      © 2025 Lincoln National Corporation | WellnessPATH® Marketplace
    </motion.footer>
  )
}
