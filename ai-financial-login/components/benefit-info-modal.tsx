"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface BenefitInfoModalProps {
  isOpen: boolean
  onClose: () => void
  benefitName: string
  benefitIcon: React.ComponentType<{ className?: string }>
}

const benefitDetails: Record<
  string,
  {
    title: string
    description: string
    bulletPoints: string[]
  }
> = {
  "Health Insurance": {
    title: "Health Insurance Coverage",
    description: "Comprehensive medical coverage to protect you and your family from unexpected healthcare costs.",
    bulletPoints: [
      "Covers preventive care including annual physicals, vaccinations, and health screenings at no cost",
      "Includes hospital stays, emergency room visits, surgeries, and specialist consultations",
      "Prescription drug coverage with tiered copays for generic and brand-name medications",
      "Maternity and newborn care including prenatal visits, delivery, and postnatal checkups",
      "Mental health services and substance abuse treatment with same coverage as medical care",
    ],
  },
  "Dental Insurance": {
    title: "Dental Insurance Coverage",
    description: "Keep your smile healthy with comprehensive dental care coverage for routine and major procedures.",
    bulletPoints: [
      "100% coverage for preventive care including cleanings, exams, and X-rays (2 visits per year)",
      "80% coverage for basic procedures like fillings, extractions, and root canals",
      "50% coverage for major work including crowns, bridges, dentures, and implants",
      "Orthodontic coverage available for children and adults up to $1,500 lifetime maximum",
      "No waiting period for preventive care; 6-month wait for basic, 12-month for major procedures",
    ],
  },
  "Vision Insurance": {
    title: "Vision Insurance Coverage",
    description: "Protect your eyesight with coverage for exams, glasses, and contact lenses.",
    bulletPoints: [
      "Annual comprehensive eye exam with $10 copay to check vision and eye health",
      "New prescription glasses every 12 months with $25 copay for frames and lenses",
      "Contact lens allowance of $150 per year in lieu of glasses",
      "20% discount on LASIK and PRK laser vision correction surgery",
      "Coverage for lens enhancements including anti-reflective coating and progressive lenses",
    ],
  },
  "Short-Term Disability": {
    title: "Short-Term Disability Coverage",
    description: "Income protection when you're temporarily unable to work due to illness, injury, or maternity leave.",
    bulletPoints: [
      "Replaces 60% of your weekly salary up to $1,500 per week for up to 12 weeks",
      "Covers maternity leave starting from delivery date with no waiting period",
      "7-day waiting period for illness or injury before benefits begin",
      "Includes complications from pregnancy, surgery recovery, and serious medical conditions",
      "Benefits coordinate with state disability programs to maximize your income replacement",
    ],
  },
  "Long-Term Disability": {
    title: "Long-Term Disability Coverage",
    description: "Financial security if you're unable to work for an extended period due to serious illness or injury.",
    bulletPoints: [
      "Replaces 60% of your monthly salary if disabled for more than 90 days",
      "Coverage continues until age 65 or until you can return to work",
      "Includes partial disability benefits if you can work part-time during recovery",
      "Covers chronic illnesses, severe injuries, mental health conditions, and cancer treatment",
      "Rehabilitation and vocational training support to help you return to work when possible",
    ],
  },
  "Life Insurance": {
    title: "Life Insurance Coverage",
    description: "Provide financial protection for your loved ones in the event of your death.",
    bulletPoints: [
      "Basic coverage of 1x your annual salary provided by employer at no cost",
      "Option to purchase additional coverage up to 5x your salary with medical underwriting",
      "Accidental death benefit pays double the face amount if death is due to accident",
      "Portable coverage - take your policy with you if you leave the company",
      "Beneficiary receives tax-free lump sum payment to cover funeral costs and living expenses",
    ],
  },
  "Accident Insurance": {
    title: "Accident Insurance Coverage",
    description: "Extra financial protection for unexpected injuries and accidents that require medical attention.",
    bulletPoints: [
      "Lump sum cash benefit paid directly to you for covered accidents and injuries",
      "Covers emergency room visits, ambulance rides, hospital stays, and surgery costs",
      "Benefits for fractures, dislocations, burns, lacerations requiring stitches, and concussions",
      "Additional benefits for physical therapy, medical equipment, and follow-up care",
      "No deductibles or copays - benefits paid in addition to your health insurance",
    ],
  },
  "AD&D Insurance": {
    title: "Accidental Death & Dismemberment Coverage",
    description: "Additional protection for you and your family in case of accidental death or serious injury.",
    bulletPoints: [
      "Pays full benefit amount for accidental death or loss of two or more body parts",
      "Partial benefits for loss of one limb, hand, foot, eye, or hearing in both ears",
      "Covers accidents at work, home, or while traveling anywhere in the world",
      "Seat belt and airbag benefits provide additional payment if accident occurs in vehicle",
      "Education benefit pays up to $10,000 per child for college expenses if you die in accident",
    ],
  },
}

export function BenefitInfoModal({ isOpen, onClose, benefitName, benefitIcon: Icon }: BenefitInfoModalProps) {
  const details = benefitDetails[benefitName]

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

  if (!details) return null

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="benefit-info-title"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-r from-[#a50034] to-[#7d1f3c] p-6 sm:p-8 rounded-t-3xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h2 id="benefit-info-title" className="text-xl sm:text-2xl font-bold text-white">
                        {details.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/90 mt-1">{details.description}</p>
                    </div>
                  </div>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-white hover:bg-white/20 rounded-full"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Coverage Details</h3>
                <ul className="space-y-4">
                  {details.bulletPoints.map((point, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex gap-4 items-start group"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#a50034] to-[#7d1f3c] flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <p className="text-[#4a4a4a] leading-relaxed flex-1 pt-1">{point}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent p-6 sm:p-8 pt-4 rounded-b-3xl">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-[#a50034] to-[#7d1f3c] hover:from-[#7d1f3c] hover:to-[#a50034] text-white shadow-lg rounded-xl font-semibold h-12"
                >
                  Got it, thanks!
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
