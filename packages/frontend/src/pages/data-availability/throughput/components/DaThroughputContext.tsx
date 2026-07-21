import { createContext, type ReactNode, useContext, useState } from 'react'

interface IncludeLayer2sOnlyContextType {
  includeLayer2sOnly: boolean
  setIncludeLayer2sOnly: (value: boolean) => void
}

const IncludeLayer2sOnlyContext = createContext<
  IncludeLayer2sOnlyContextType | undefined
>(undefined)

interface IncludeLayer2sOnlyProviderProps {
  children: ReactNode
}

export function IncludeLayer2sOnlyProvider({
  children,
}: IncludeLayer2sOnlyProviderProps) {
  const [includeLayer2sOnly, setIncludeLayer2sOnly] = useState(true)

  return (
    <IncludeLayer2sOnlyContext.Provider
      value={{ includeLayer2sOnly, setIncludeLayer2sOnly }}
    >
      {children}
    </IncludeLayer2sOnlyContext.Provider>
  )
}

export function useIncludeLayer2sOnly() {
  const context = useContext(IncludeLayer2sOnlyContext)
  if (!context) {
    throw new Error(
      'useIncludeLayer2sOnly must be used within IncludeLayer2sOnlyProvider',
    )
  }
  return context
}
