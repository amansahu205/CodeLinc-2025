"use client"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { AnimatedDashboardBackground } from "@/components/animated-dashboard-background"
import { BenefitCards } from "@/components/benefit-cards"
import { BenefitsStickyFooter } from "@/components/benefits-sticky-footer"
import { ChatSidebarPlaceholder } from "@/components/chat-sidebar-placeholder"
import { PlanComparisonModal } from "@/components/plan-comparison-modal"
import { Toast } from "@/components/toast"
import { useState, useRef } from "react"

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [totalCost, setTotalCost] = useState(45.5)
  const [highlightFooter, setHighlightFooter] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

  const handleCompareHealthPlans = () => {
    setIsModalOpen(true)
  }

  const handleShowTotalCost = () => {
    if (footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
      setHighlightFooter(true)
      setTimeout(() => setHighlightFooter(false), 1200)
    }
  }

  const handlePlanSelect = (planName: string, planCost: number) => {
    setTotalCost(planCost)
    setToastMessage(`${planName} selected! Cost updated to $${planCost.toFixed(2)} per paycheck.`)
    setShowToast(true)
    setIsModalOpen(false)

    setHighlightFooter(true)
    setTimeout(() => setHighlightFooter(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedDashboardBackground />

      <DashboardNavbar />

      <div className="flex flex-1 relative z-10">
        <main className="flex-1 overflow-y-auto relative pb-32">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <BenefitCards onPlanSelect={handlePlanSelect} />
          </div>
        </main>

        <ChatSidebarPlaceholder onCompareHealthPlans={handleCompareHealthPlans} onShowTotalCost={handleShowTotalCost} />
      </div>

      <BenefitsStickyFooter ref={footerRef} totalCost={totalCost} highlight={highlightFooter} />

      <PlanComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        benefitName="Health Insurance"
        onSelectPlan={handlePlanSelect}
      />

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </div>
  )
}
