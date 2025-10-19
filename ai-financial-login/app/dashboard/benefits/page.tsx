"use client"

import { useState, useRef } from "react"
import { DashboardNavbar } from "@/components/dashboard-navbar"
import { AnimatedDashboardBackground } from "@/components/animated-dashboard-background"
import { BenefitsProfileBar } from "@/components/benefits-profile-bar"
import { BenefitCards } from "@/components/benefit-cards"
import { BenefitsStickyFooter } from "@/components/benefits-sticky-footer"
import { ChatSidebarPlaceholder } from "@/components/chat-sidebar-placeholder"
import { PlanComparisonModal } from "@/components/plan-comparison-modal"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

export default function BenefitsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [totalCost, setTotalCost] = useState(0)
  const [highlightFooter, setHighlightFooter] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleCompareHealthPlans = () => {
    setIsModalOpen(true)
  }

  const handleSelectPlan = (planName: string, planCost: number) => {
    setTotalCost((prev) => prev + planCost)
    setIsModalOpen(false)

    toast({
      title: "Plan Added",
      description: `${planName} plan added (+$${planCost.toFixed(2)}). Your total is now $${(totalCost + planCost).toFixed(2)} per paycheck.`,
      duration: 3000,
    })

    setHighlightFooter(true)
    setTimeout(() => setHighlightFooter(false), 2000)
  }

  const handleShowTotalCost = () => {
    footerRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    setHighlightFooter(true)
    setTimeout(() => setHighlightFooter(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedDashboardBackground />

      <DashboardNavbar />

      <div className="flex flex-1 relative z-10">
        <main
          className="flex-1 overflow-y-auto relative scroll-smooth"
          style={{
            marginRight: "0",
            paddingBottom: "140px",
          }}
        >
          <style jsx>{`
            @media (min-width: 1024px) {
              main {
                margin-right: 500px !important;
                padding-bottom: 120px !important;
              }
            }
          `}</style>

          <BenefitsProfileBar />

          <div className="p-4 sm:p-6 lg:p-8 relative">
            <div className="max-w-7xl mx-auto">
              <BenefitCards onPlanSelect={handleSelectPlan} />
            </div>
          </div>
        </main>

        <ChatSidebarPlaceholder onCompareHealthPlans={handleCompareHealthPlans} onShowTotalCost={handleShowTotalCost} />
      </div>

      <BenefitsStickyFooter ref={footerRef} totalCost={totalCost} highlight={highlightFooter} />

      <PlanComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        benefitName="Health Insurance"
        onSelectPlan={handleSelectPlan}
      />

      <Toaster />
    </div>
  )
}
