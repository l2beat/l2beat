import { createContext, useContext, useState } from 'react'

type Layer2sRwaRestrictedTokensContextValue = {
  excludeRwaRestrictedTokens: boolean
  setExcludeRwaRestrictedTokens: (value: boolean) => void
}

const Layer2sRwaRestrictedTokensContext = createContext<
  Layer2sRwaRestrictedTokensContextValue | undefined
>(undefined)

export function useLayer2sRwaRestrictedTokensContext() {
  const context = useContext(Layer2sRwaRestrictedTokensContext)
  if (!context) {
    throw new Error(
      'useLayer2sRwaRestrictedTokensContext must be used within a Layer2sRwaRestrictedTokensContext',
    )
  }

  return context
}

export function Layer2sRwaRestrictedTokensContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<boolean>(true)

  return (
    <Layer2sRwaRestrictedTokensContext.Provider
      value={{
        excludeRwaRestrictedTokens: value,
        setExcludeRwaRestrictedTokens: setValue,
      }}
    >
      {children}
    </Layer2sRwaRestrictedTokensContext.Provider>
  )
}
