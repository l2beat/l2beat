'use client'

import { createContext, useContext, useState } from 'react'

const MobileNavContext = createContext<{
  open: boolean
  setOpen: (open: boolean) => void
} | null>(null)

export function MobileNavProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <MobileNavContext.Provider value={{ open, setOpen }}>
      {children}
    </MobileNavContext.Provider>
  )
}

export function useMobileNav() {
  const context = useContext(MobileNavContext)
  if (!context) {
    throw new Error('useMobileNav must be used within a MobileNavProvider')
  }

  return context
}
