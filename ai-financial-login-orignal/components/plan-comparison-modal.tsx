"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Shield, Heart, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect } from "react"

interface PlanComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  benefitName: string
  onSelectPlan: (planName: string, planCost: number) => void
}

const plans = [
  {
    name: "HDHP",
    fullName: "High Deductible Health Plan",
    icon: Shield,
    premium: "$15.00",
    premiumValue: 15,
    deductible: "$3,000",
    oopMax: "$6,000",
    copay: "$0 after deductible",
    features: ["HSA eligible", "Lower premiums", "Best for healthy individuals"],
    recommended: true,
    badge: "Top Pick",
  },
  {
    name: "PPO",
    fullName: "Preferred Provider Organization",
    icon: Heart,
    premium: "$45.00",
    premiumValue: 45,
    deductible: "$1,000",
    oopMax: "$4,000",
    copay: "$20",
    features: ["Flexible network", "No referrals needed", "Balanced coverage"],
    badge: "Balanced Choice",
  },
  {
    name: "HMO",
    fullName: "Health Maintenance Organization",
    icon: Building,
    premium: "$25.00",
    premiumValue: 25,
    deductible: "$500",
    oopMax: "$3,000",
    copay: "$15",
    features: ["Low cost", "Primary care focused", "Referrals required"],
    badge: "Budget Plan",
  },
]

export function PlanComparisonModal({ isOpen, onClose, benefitName, onSelectPlan }: PlanComparisonModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-3 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="backdrop-blur-md bg-white/80 rounded-xl sm:rounded-2xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border-white/40">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#a50034] to-[#7d1f3c] p-4 sm:p-6 flex items-center justify-between">
                <h2 id="modal-title" className="text-lg sm:text-2xl font-bold text-white">
                  Compare {benefitName} Plans
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {plans.map((plan, index) => {
                    const Icon = plan.icon
                    return (
                      <motion.div
                        key={plan.name}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={`relative rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4 transition-all duration-300 ${
                          plan.recommended
                            ? "bg-gradient-to-br from-[#a50034]/10 to-[#EED9B7]/20 border-2 border-[#a50034] shadow-lg"
                            : "bg-[#F7F6F5] border border-[#DADADA] hover:shadow-md"
                        }`}
                      >
                        {plan.recommended && (
                          <Badge className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 bg-[#a50034] text-white border-none shadow-md text-xs">
                            {plan.badge}
                          </Badge>
                        )}

                        <div className="flex items-center gap-2 sm:gap-3 pt-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#a50034] to-[#7d1f3c] flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-[#333333]">{plan.name}</h3>
                            <p className="text-[10px] sm:text-xs text-[#666666]">{plan.fullName}</p>
                          </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex justify-between items-center py-2 border-b border-[#DADADA]">
                            <span className="text-xs sm:text-sm text-[#666666]">Premium</span>
                            <span className="font-semibold text-[#333333] text-xs sm:text-base">
                              {plan.premium}/paycheck
                            </span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-[#DADADA]">
                            <span className="text-xs sm:text-sm text-[#666666]">Deductible</span>
                            <span className="font-semibold text-[#333333] text-xs sm:text-base">{plan.deductible}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-[#DADADA]">
                            <span className="text-xs sm:text-sm text-[#666666]">OOP Max</span>
                            <span className="font-semibold text-[#333333] text-xs sm:text-base">{plan.oopMax}</span>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b border-[#DADADA]">
                            <span className="text-xs sm:text-sm text-[#666666]">Copay</span>
                            <span className="font-semibold text-[#333333] text-xs sm:text-base">{plan.copay}</span>
                          </div>

                          <div className="pt-2 space-y-2">
                            {plan.features.map((feature) => (
                              <div key={feature} className="flex items-start gap-2">
                                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#a50034] mt-0.5 flex-shrink-0" />
                                <span className="text-[10px] sm:text-xs text-[#666666]">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          onClick={() => onSelectPlan(plan.name, plan.premiumValue)}
                          className={`w-full transition-all duration-300 text-xs sm:text-sm h-9 sm:h-10 ${
                            plan.recommended
                              ? "bg-gradient-to-r from-[#a50034] to-[#7d1f3c] hover:from-[#7d1f3c] hover:to-[#a50034]"
                              : "bg-[#1C2431] hover:bg-[#1C2431]/90"
                          } text-white`}
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Choose this Plan
                        </Button>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
