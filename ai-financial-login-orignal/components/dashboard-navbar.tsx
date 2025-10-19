"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, ChevronDown, Menu } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export function DashboardNavbar() {
  const [activeTab, setActiveTab] = useState("Benefits")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const tabs = ["Benefits", "Money Moves", "Learning Hub", "Tools"]

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full backdrop-blur-xl bg-white/60 border-b border-white/30 px-4 sm:px-6 py-3 sm:py-4 relative z-20 shadow-md"
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative px-3 sm:px-4 py-2 rounded-xl backdrop-blur-sm bg-white/60 border border-white/40 shadow-lg flex-shrink-0"
          style={{
            boxShadow: "0 8px 32px rgba(165, 0, 52, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
          }}
        >
          <Image
            src="/lincoln-financial-logo.png"
            alt="Lincoln Financial"
            width={200}
            height={60}
            className="h-8 sm:h-10 w-auto drop-shadow-sm"
            priority
          />
        </motion.div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex gap-1 flex-1" role="tablist">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 xl:px-6 py-2 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a50034] focus:ring-offset-2 text-sm xl:text-base ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#a50034] to-[#7d1f3c] text-white shadow-lg"
                  : "text-[#4a4a4a] hover:bg-white/50 hover:text-[#1a1a1a]"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              role="tab"
              aria-selected={activeTab === tab}
              aria-label={`Navigate to ${tab}`}
            >
              {tab}
            </motion.button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/70 border border-white/50 shadow-md"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-[#1a1a1a]" />
        </button>

        {/* User Account Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2 rounded-xl backdrop-blur-md bg-white/70 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#a50034] focus:ring-offset-2 group flex-shrink-0"
              style={{
                boxShadow: "0 4px 24px rgba(165, 0, 52, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
              aria-label="User menu"
            >
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-[#a50034] shadow-md ring-2 ring-white/50">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-[#a50034] to-[#7d1f3c] text-white">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-[#1a1a1a] leading-tight">John Doe</span>
                <span className="text-xs text-[#4a4a4a] leading-tight">View Profile</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#4a4a4a] group-hover:text-[#a50034] transition-colors duration-300 hidden sm:block" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 backdrop-blur-xl bg-white/95 border border-white/50 shadow-2xl"
            style={{
              boxShadow: "0 8px 32px rgba(165, 0, 52, 0.12)",
            }}
          >
            <DropdownMenuLabel className="text-[#1a1a1a] font-semibold">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#d0d0d0]/50" />
            <DropdownMenuItem className="cursor-pointer hover:bg-[#F7F6F5] focus:bg-[#F7F6F5] transition-colors">
              <User className="mr-2 h-4 w-4 text-[#a50034]" />
              <span className="text-[#1a1a1a]">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#F7F6F5] focus:bg-[#F7F6F5] transition-colors">
              <Settings className="mr-2 h-4 w-4 text-[#a50034]" />
              <span className="text-[#1a1a1a]">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#d0d0d0]/50" />
            <DropdownMenuItem className="cursor-pointer text-[#a50034] hover:bg-red-50 focus:bg-red-50 transition-colors font-medium">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="lg:hidden mt-4 pt-4 border-t border-white/30"
          role="tablist"
        >
          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setMobileMenuOpen(false)
                }}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 text-left ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#a50034] to-[#7d1f3c] text-white shadow-lg"
                    : "text-[#4a4a4a] hover:bg-white/50 hover:text-[#1a1a1a]"
                }`}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.nav>
      )}
    </motion.header>
  )
}
