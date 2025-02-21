'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'

interface IncludeOnlyL2sContextType {
  includeL2sOnly: boolean
  setIncludeL2sOnly: (value: boolean) => void
}

const IncludeOnlyL2sContext = createContext<
  IncludeOnlyL2sContextType | undefined
>(undefined)

interface IncludeOnlyL2sProviderProps {
  children: ReactNode
}

export function IncludeOnlyL2sProvider({
  children,
}: IncludeOnlyL2sProviderProps) {
  const [includeL2sOnly, setIncludeL2sOnly] = useState(false)

  return (
    <IncludeOnlyL2sContext.Provider
      value={{ includeL2sOnly, setIncludeL2sOnly }}
    >
      {children}
    </IncludeOnlyL2sContext.Provider>
  )
}

export function useIncludeOnlyL2s() {
  const context = useContext(IncludeOnlyL2sContext)
  if (!context) {
    throw new Error(
      'useIncludeOnlyL2s must be used within IncludeOnlyL2sProvider',
    )
  }
  return context
}
