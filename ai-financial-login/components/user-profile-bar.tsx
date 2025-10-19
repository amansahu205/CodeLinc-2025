"use client"

import { motion } from "framer-motion"
import { User, DollarSign, Users, Calendar } from "lucide-react"

interface UserProfileBarProps {
  user: {
    name: string
    age: number
    salary: number
    dependents: number
  }
}

export function UserProfileBar({ user }: UserProfileBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #A50034 0%, #1C2431 100%)",
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EED9B7]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
      
      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.name}</h2>
            <p className="text-white/80 text-sm">Your Benefits Profile</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EED9B7]/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#EED9B7]" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium">Age</p>
                <p className="text-white text-xl font-bold">{user.age}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EED9B7]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-[#EED9B7]" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium">Annual Salary</p>
                <p className="text-white text-xl font-bold">${(user.salary / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, y: -2 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#EED9B7]/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#EED9B7]" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium">Dependents</p>
                <p className="text-white text-xl font-bold">{user.dependents}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
