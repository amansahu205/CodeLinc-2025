"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function LogoHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full backdrop-blur-md bg-white/40 border-b border-white/20 px-6 py-4 relative z-10"
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div
          className="px-4 py-2 rounded-xl backdrop-blur-sm bg-white/60 border border-white/40 shadow-lg"
          style={{
            boxShadow: "0 8px 32px rgba(165, 0, 52, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          }}
        >
          <Image
            src="/lincoln-financial-logo.png"
            alt="Lincoln Financial Group Logo"
            width={200}
            height={60}
            className="h-10 w-auto drop-shadow-sm"
            priority
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#1C2431]">Lincoln Wellness Assistant</h1>
      </div>
    </motion.header>
  )
}
