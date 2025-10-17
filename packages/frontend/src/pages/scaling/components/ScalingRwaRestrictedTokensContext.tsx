import { createContext, useContext, useState } from 'react'

type ScalingRwaRestrictedTokensContextValue = {
  includeRwaRestrictedTokens: boolean
  setIncludeRwaRestrictedTokens: (value: boolean) => void
}

const ScalingRwaRestrictedTokensContext = createContext<
  ScalingRwaRestrictedTokensContextValue | undefined
>(undefined)

export function useScalingRwaRestrictedTokensContext() {
  const context = useContext(ScalingRwaRestrictedTokensContext)
  if (!context) {
    throw new Error(
      'useScalingRwaRestrictedTokensContext must be used within a ScalingRwaRestrictedTokensContext',
    )
  }

  return context
}

export function ScalingRwaRestrictedTokensContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<boolean>(false)

  return (
    <ScalingRwaRestrictedTokensContext.Provider
      value={{
        includeRwaRestrictedTokens: value,
        setIncludeRwaRestrictedTokens: setValue,
      }}
    >
      {children}
    </ScalingRwaRestrictedTokensContext.Provider>
  )
}
