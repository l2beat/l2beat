import { createContext, type ReactNode, useContext, useState } from 'react'

interface IncludeScalingOnlyContextType {
  includeScalingOnly: boolean
  setIncludeScalingOnly: (value: boolean) => void
}

const IncludeScalingOnlyContext = createContext<
  IncludeScalingOnlyContextType | undefined
>(undefined)

interface IncludeScalingOnlyProviderProps {
  children: ReactNode
}

export function IncludeScalingOnlyProvider({
  children,
}: IncludeScalingOnlyProviderProps) {
  const [includeScalingOnly, setIncludeScalingOnly] = useState(true)

  return (
    <IncludeScalingOnlyContext.Provider
      value={{ includeScalingOnly, setIncludeScalingOnly }}
    >
      {children}
    </IncludeScalingOnlyContext.Provider>
  )
}

export function useIncludeScalingOnly() {
  const context = useContext(IncludeScalingOnlyContext)
  if (!context) {
    throw new Error(
      'useIncludeScalingOnly must be used within IncludeScalingOnlyProvider',
    )
  }
  return context
}
