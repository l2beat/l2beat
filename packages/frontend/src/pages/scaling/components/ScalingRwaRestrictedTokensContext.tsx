import { createContext, useContext, useState } from 'react'

type ScalingRwaRestrictedTokensContextValue = {
  excludeRwaRestrictedTokens: boolean
  setExcludeRwaRestrictedTokens: (value: boolean) => void
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
  const [value, setValue] = useState<boolean>(true)

  return (
    <ScalingRwaRestrictedTokensContext.Provider
      value={{
        excludeRwaRestrictedTokens: value,
        setExcludeRwaRestrictedTokens: setValue,
      }}
    >
      {children}
    </ScalingRwaRestrictedTokensContext.Provider>
  )
}
