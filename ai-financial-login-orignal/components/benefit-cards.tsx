"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Heart, Smile, Eye, Shield, ShieldCheck, Umbrella, AlertCircle, Plus, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PlanComparisonModal } from "@/components/plan-comparison-modal"
import { BenefitInfoModal } from "@/components/benefit-info-modal"

const benefits = [
  {
    icon: Heart,
    name: "Health Insurance",
    tag: "Recommended",
    tagColor: "bg-[#a50034] text-white",
    rationale: "Essential coverage for prenatal care and delivery",
    detailedInfo:
      "Provides coverage for major medical expenses, hospital visits, preventive care, and prescription medications.",
    cost: "$45.20",
    color: "from-[#a50034] to-[#7d1f3c]",
  },
  {
    icon: Smile,
    name: "Dental Insurance",
    tag: "Consider",
    tagColor: "bg-[#d4b896] text-[#1a1a1a]",
    rationale: "Preventive care and routine checkups covered",
    detailedInfo: "Covers routine cleanings, X-rays, fillings, and major dental work like crowns and root canals.",
    cost: "$8.50",
    color: "from-[#1C2431] to-[#a50034]",
  },
  {
    icon: Eye,
    name: "Vision Insurance",
    tag: "Consider",
    tagColor: "bg-[#d4b896] text-[#1a1a1a]",
    rationale: "Annual eye exams and prescription glasses",
    detailedInfo: "Helps pay for eye exams, glasses, contact lenses, and discounts on LASIK surgery.",
    cost: "$3.20",
    color: "from-[#1C2431] to-[#a50034]",
  },
  {
    icon: Shield,
    name: "Short-Term Disability",
    tag: "Recommended",
    tagColor: "bg-[#a50034] text-white",
    rationale: "Covers maternity leave income replacement",
    detailedInfo: "Provides partial income replacement during maternity leave or temporary illness for up to 12 weeks.",
    cost: "$5.20",
    color: "from-[#a50034] to-[#7d1f3c]",
  },
  {
    icon: ShieldCheck,
    name: "Long-Term Disability",
    tag: "Consider",
    tagColor: "bg-[#d4b896] text-[#1a1a1a]",
    rationale: "Protects income if unable to work long-term",
    detailedInfo: "Safeguards your income in case of long-term injury or illness that prevents you from working.",
    cost: "$12.40",
    color: "from-[#1C2431] to-[#a50034]",
  },
  {
    icon: Umbrella,
    name: "Life Insurance",
    tag: "Recommended",
    tagColor: "bg-[#a50034] text-white",
    rationale: "Financial protection for your growing family",
    detailedInfo:
      "Provides financial support for your family in the event of your death, covering funeral costs and living expenses.",
    cost: "$8.90",
    color: "from-[#a50034] to-[#7d1f3c]",
  },
  {
    icon: AlertCircle,
    name: "Accident Insurance",
    tag: "Consider",
    tagColor: "bg-[#d4b896] text-[#1a1a1a]",
    rationale: "Coverage for unexpected injuries and accidents",
    detailedInfo:
      "Helps cover costs due to injury or accident, including emergency room visits and ambulance services.",
    cost: "$6.75",
    color: "from-[#1C2431] to-[#a50034]",
  },
  {
    icon: Plus,
    name: "AD&D Insurance",
    tag: "Consider",
    tagColor: "bg-[#d4b896] text-[#1a1a1a]",
    rationale: "Accidental death and dismemberment protection",
    detailedInfo: "Extra coverage for accidental death or injury resulting in loss of limb, sight, or hearing.",
    cost: "$4.30",
    color: "from-[#1C2431] to-[#a50034]",
  },
]

interface BenefitCardsProps {
  onPlanSelect?: (planName: string, planCost: number) => void
}

export function BenefitCards({ onPlanSelect }: BenefitCardsProps) {
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null)
  const [infoModalBenefit, setInfoModalBenefit] = useState<string | null>(null)
  const [infoModalIcon, setInfoModalIcon] = useState<React.ComponentType<{ className?: string }> | null>(null)

  const handlePlanSelect = (planName: string, planCost: number) => {
    setSelectedBenefit(null)
    onPlanSelect?.(planName, planCost)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ gap: "24px" }}
      >
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon
          return (
            <motion.div
              key={benefit.name}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative backdrop-blur-xl bg-white/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/40"
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                borderRadius: "16px",
              }}
            >
              <div className={`bg-gradient-to-r ${benefit.color} p-4 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm sm:text-base">{benefit.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${benefit.tagColor} border-none text-xs font-semibold`}>{benefit.tag}</Badge>
                  <button
                    onClick={() => {
                      setInfoModalBenefit(benefit.name)
                      setInfoModalIcon(() => benefit.icon)
                    }}
                    className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={`More information about ${benefit.name}`}
                    tabIndex={0}
                  >
                    <Info className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{benefit.rationale}</p>

                <div className="flex items-center justify-between pt-2 border-t border-white/40">
                  <div>
                    <p className="text-xs text-[#4a4a4a] font-medium">Cost per paycheck</p>
                    <p className="text-2xl font-bold text-[#a50034]">{benefit.cost}</p>
                  </div>
                  <Button
                    onClick={() => setSelectedBenefit(benefit.name)}
                    className="bg-gradient-to-r from-[#a50034] to-[#7d1f3c] hover:from-[#7d1f3c] hover:to-[#a50034] text-white shadow-lg rounded-xl font-semibold"
                  >
                    Compare Plans
                  </Button>
                </div>
              </div>

              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                style={{
                  background: "radial-gradient(circle at 50% 50%, rgba(165, 0, 52, 0.15) 0%, transparent 70%)",
                  boxShadow: "inset 0 0 20px rgba(238, 217, 183, 0.3)",
                }}
              />
            </motion.div>
          )
        })}
      </motion.div>

      {infoModalBenefit && infoModalIcon && (
        <BenefitInfoModal
          isOpen={infoModalBenefit !== null}
          onClose={() => {
            setInfoModalBenefit(null)
            setInfoModalIcon(null)
          }}
          benefitName={infoModalBenefit}
          benefitIcon={infoModalIcon}
        />
      )}

      <PlanComparisonModal
        isOpen={selectedBenefit !== null}
        onClose={() => setSelectedBenefit(null)}
        benefitName={selectedBenefit || ""}
        onSelectPlan={handlePlanSelect}
      />
    </>
  )
}
