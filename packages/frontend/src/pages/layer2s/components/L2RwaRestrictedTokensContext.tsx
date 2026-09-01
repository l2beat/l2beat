import { createContext, useContext, useState } from 'react'

type L2RwaRestrictedTokensContextValue = {
  excludeRwaRestrictedTokens: boolean
  setExcludeRwaRestrictedTokens: (value: boolean) => void
}

const L2RwaRestrictedTokensContext = createContext<
  L2RwaRestrictedTokensContextValue | undefined
>(undefined)

export function useL2RwaRestrictedTokensContext() {
  const context = useContext(L2RwaRestrictedTokensContext)
  if (!context) {
    throw new Error(
      'useL2RwaRestrictedTokensContext must be used within a L2RwaRestrictedTokensContext',
    )
  }

  return context
}

export function L2RwaRestrictedTokensContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<boolean>(true)

  return (
    <L2RwaRestrictedTokensContext.Provider
      value={{
        excludeRwaRestrictedTokens: value,
        setExcludeRwaRestrictedTokens: setValue,
      }}
    >
      {children}
    </L2RwaRestrictedTokensContext.Provider>
  )
}
