"use client"

import { LogoHeader } from "@/components/logo-header"
import { EnhancedLoginForm } from "@/components/enhanced-login-form"
import { FooterNotice } from "@/components/footer-notice"
import { ChatIconPlaceholder } from "@/components/chat-icon-placeholder"
import { AnimatedBackground } from "@/components/animated-background"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-br from-[#F7F6F5] via-[#EED9B7]/30 to-white">
      <AnimatedBackground />
      <LogoHeader />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <EnhancedLoginForm />
      </main>
      <FooterNotice />
      <ChatIconPlaceholder />
    </div>
  )
}
