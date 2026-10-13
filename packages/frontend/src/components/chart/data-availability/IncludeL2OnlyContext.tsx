import { createContext, type ReactNode, useContext, useState } from 'react'

interface IncludeL2OnlyContextType {
  includeL2Only: boolean
  setIncludeL2Only: (value: boolean) => void
}

const IncludeL2OnlyContext = createContext<
  IncludeL2OnlyContextType | undefined
>(undefined)

interface IncludeL2OnlyProviderProps {
  children: ReactNode
}

export function IncludeL2OnlyProvider({
  children,
}: IncludeL2OnlyProviderProps) {
  const [includeL2Only, setIncludeL2Only] = useState(true)

  return (
    <IncludeL2OnlyContext.Provider value={{ includeL2Only, setIncludeL2Only }}>
      {children}
    </IncludeL2OnlyContext.Provider>
  )
}

export function useIncludeL2Only() {
  const context = useContext(IncludeL2OnlyContext)
  if (!context) {
    throw new Error(
      'useIncludeL2Only must be used within IncludeL2OnlyProvider',
    )
  }
  return context
}
