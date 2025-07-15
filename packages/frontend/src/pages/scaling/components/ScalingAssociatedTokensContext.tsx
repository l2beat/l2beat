import { createContext, useContext, useState } from 'react'

type ScalingAssociatedTokensContextValue = {
  excludeAssociatedTokens: boolean
  setExcludeAssociatedTokens: (value: boolean) => void
}

const ScalingAssociatedTokensContext = createContext<
  ScalingAssociatedTokensContextValue | undefined
>(undefined)

export function useScalingAssociatedTokensContext() {
  const context = useContext(ScalingAssociatedTokensContext)
  if (!context) {
    throw new Error(
      'useScalingAssociatedTokensContext must be used within a ScalingAssociatedTokensContext',
    )
  }

  return context
}

export function ScalingAssociatedTokensContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [value, setValue] = useState<boolean>(false)

  return (
    <ScalingAssociatedTokensContext.Provider
      value={{
        excludeAssociatedTokens: value,
        setExcludeAssociatedTokens: setValue,
      }}
    >
      {children}
    </ScalingAssociatedTokensContext.Provider>
  )
}
