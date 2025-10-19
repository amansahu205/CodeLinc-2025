"use client"

import { DashboardNavbar } from "@/components/dashboard-navbar"
import { AnimatedDashboardBackground } from "@/components/animated-dashboard-background"
import { BenefitCards } from "@/components/benefit-cards"
import { BenefitsStickyFooter } from "@/components/benefits-sticky-footer"
import { ChatSidebarPlaceholder } from "@/components/chat-sidebar-placeholder"
import { PlanComparisonModal } from "@/components/plan-comparison-modal"
import { Toast } from "@/components/toast"
import { UserProfileBar } from "@/components/user-profile-bar"
import { useState, useRef, useEffect } from "react"
import { auth } from "@/lib/auth"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [benefits, setBenefits] = useState<any[]>([])
  const [selections, setSelections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null)
  const [toastMessage, setToastMessage] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [totalCost, setTotalCost] = useState(0)
  const [highlightFooter, setHighlightFooter] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentUser = auth.getUser()
    const token = auth.getToken()
    
    if (!currentUser || !token) {
      router.push('/')
      return
    }
    
    setUser(currentUser)
    loadBenefits(token)
    loadSelections(token)
  }, [router])

  const loadBenefits = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/benefits')
      const data = await response.json()
      setBenefits(data.benefits || [])
    } catch (err) {
      console.error('Failed to load benefits', err)
    } finally {
      setLoading(false)
    }
  }

  const loadSelections = async (token: string) => {
    try {
      const data = await api.getSelections(token)
      setSelections(data.selections || [])
      calculateTotal(data.selections || [])
    } catch (err) {
      console.error('Failed to load selections', err)
    }
  }

  const calculateTotal = (selectedPlans: any[]) => {
    const total = selectedPlans.reduce((sum, plan) => sum + (plan.cost || 0), 0)
    setTotalCost(total)
  }

  const handleComparePlans = (benefit: any) => {
    setSelectedBenefit(benefit)
    setIsModalOpen(true)
  }

  const handlePlanSelect = async (planId: number, planName: string, planCost: number) => {
    const token = auth.getToken()
    if (!token) return

    try {
      await api.saveSelection(token, planId)
      const newSelection = { 
        id: planId, 
        planId: planId,
        name: planName, 
        cost: planCost, 
        benefitId: selectedBenefit?.id 
      }
      const updatedSelections = [...selections.filter(s => s.benefitId !== selectedBenefit?.id), newSelection]
      setSelections(updatedSelections)
      calculateTotal(updatedSelections)
      setToastMessage(`✓ ${planName} selected! $${planCost.toFixed(2)}/paycheck`)
      setShowToast(true)
      setIsModalOpen(false)
      setHighlightFooter(true)
      setTimeout(() => setHighlightFooter(false), 2000)
    } catch (err) {
      setToastMessage('Failed to save selection')
      setShowToast(true)
    }
  }

  const handleRecommendations = (recommendations: any) => {
    // Update benefit labels based on AI recommendations
    const updated = benefits.map(b => {
      const rec = recommendations.find((r: any) => r.name === b.name)
      if (rec) {
        return { ...b, recommendation: rec.level }
      }
      return b
    })
    
    // Sort by priority: Highly Recommended > Recommended > Worth Considering > Available
    const priority: Record<string, number> = {
      'Highly Recommended': 4,
      'Recommended': 3,
      'Worth Considering': 2,
      'Available': 1
    }
    
    const sorted = updated.sort((a, b) => {
      const aPriority = priority[a.recommendation || 'Available'] || 0
      const bPriority = priority[b.recommendation || 'Available'] || 0
      return bPriority - aPriority
    })
    
    setBenefits(sorted)
  }

  const handleDownloadPDF = () => {
    const { generateBenefitSummary } = require('@/lib/pdf-generator')
    generateBenefitSummary(user, selections, totalCost)
    setToastMessage('✓ PDF downloaded successfully!')
    setShowToast(true)
  }

  if (!user) return null
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <AnimatedDashboardBackground />
      <DashboardNavbar user={user} />

      <div className="flex flex-1 relative z-10">
        <main className="flex-1 overflow-y-auto relative pb-32 pr-[480px]">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {user && <UserProfileBar user={user} />}
            <BenefitCards 
              benefits={benefits}
              selections={selections}
              onComparePlans={handleComparePlans}
            />
          </div>
        </main>

        <ChatSidebarPlaceholder 
          user={user}
          onCompareHealthPlans={handleComparePlans} 
          onShowTotalCost={() => {}} 
          onRecommendations={handleRecommendations}
        />
      </div>

      <BenefitsStickyFooter 
        ref={footerRef} 
        totalCost={totalCost} 
        highlight={highlightFooter}
        user={user}
        selections={selections}
        onDownloadPDF={handleDownloadPDF}
      />

      <PlanComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        benefit={selectedBenefit}
        selectedPlanId={selections.find((s: any) => s.benefitId === selectedBenefit?.id)?.planId}
        onSelectPlan={handlePlanSelect}
      />

      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />
    </div>
  )
}
