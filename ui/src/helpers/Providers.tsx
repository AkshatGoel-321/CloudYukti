'use client'

import { SessionProvider } from "next-auth/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/context/AuthContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </AuthProvider>
    </SessionProvider>
  )
}