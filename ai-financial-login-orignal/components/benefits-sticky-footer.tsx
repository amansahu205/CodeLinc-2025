"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Download, ArrowRight, DollarSign, Calendar } from "lucide-react"
import { forwardRef } from "react"

interface BenefitsStickyFooterProps {
  totalCost?: number
  highlight?: boolean
}

export const BenefitsStickyFooter = forwardRef<HTMLDivElement, BenefitsStickyFooterProps>(
  ({ totalCost = 45.5, highlight = false }, ref) => {
    const yearlyEstimate = (totalCost * 26).toFixed(0)

    return (
      <motion.footer
        ref={ref}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-gradient-to-br from-white/90 via-[#F7F6F5]/95 to-white/90 border-t-2 border-[#d4b896]/40 shadow-[0_-8px_32px_rgba(165,0,52,0.08)] rounded-t-2xl sm:rounded-t-3xl"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
              {/* Per Paycheck Card */}
              <motion.div
                animate={{
                  boxShadow: highlight
                    ? "0 0 0 3px rgba(212, 184, 150, 0.5), 0 4px 12px rgba(165, 0, 52, 0.15)"
                    : "0 2px 8px rgba(0, 0, 0, 0.05)",
                }}
                transition={{ duration: 1.2 }}
                className="flex items-center gap-2 sm:gap-3 bg-gradient-to-br from-[#a50034] to-[#7d1f3c] text-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-lg flex-shrink-0"
              >
                <div className="bg-white/20 p-1 sm:p-1.5 rounded-lg backdrop-blur-sm">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium opacity-90">Per Paycheck</p>
                  <p className="text-lg sm:text-2xl font-bold tracking-tight">${totalCost.toFixed(2)}</p>
                </div>
              </motion.div>

              {/* Yearly Estimate Card */}
              <div className="flex items-center gap-2 sm:gap-3 bg-white/60 backdrop-blur-sm border border-[#d0d0d0]/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm flex-shrink-0">
                <div className="bg-[#d4b896]/30 p-1 sm:p-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#a50034]" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-[#4a4a4a]">Yearly Estimate</p>
                  <p className="text-base sm:text-xl font-bold text-[#1C2431]">${yearlyEstimate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                className="border-2 border-[#a50034] text-[#a50034] hover:bg-[#a50034]/10 bg-white/80 backdrop-blur-sm font-semibold transition-all duration-300 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm flex-1 sm:flex-none"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download Summary</span>
                <span className="sm:hidden">Download</span>
              </Button>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="flex-1 sm:flex-none">
                <Button className="bg-gradient-to-r from-[#a50034] to-[#7d1f3c] hover:from-[#7d1f3c] hover:to-[#a50034] text-white shadow-xl hover:shadow-2xl px-3 sm:px-6 font-semibold transition-all duration-300 ease-in-out rounded-lg sm:rounded-xl h-9 sm:h-10 text-xs sm:text-sm w-full">
                  <span className="hidden sm:inline">Proceed to Enrollment</span>
                  <span className="sm:hidden">Enroll</span>
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.footer>
    )
  },
)

BenefitsStickyFooter.displayName = "BenefitsStickyFooter"
