import { createContext, useCallback, useContext, useState } from 'react'
import type { DISPLAY_OPTIONS } from '../displayOptions'

type TvsDisplayOptionsKey = Extract<
  keyof typeof DISPLAY_OPTIONS,
  'excludeRwaRestrictedTokens' | 'excludeAssociatedTokens'
>

type TvsDisplayControlsState = Record<TvsDisplayOptionsKey, boolean>

type TvsDisplayControlsContextValue = {
  display: TvsDisplayControlsState
  setDisplay: (key: TvsDisplayOptionsKey, value: boolean) => void
}

const TvsDisplayControlsContext = createContext<
  TvsDisplayControlsContextValue | undefined
>(undefined)

export function useTvsDisplayControlsContext() {
  const context = useContext(TvsDisplayControlsContext)
  if (!context) {
    throw new Error(
      'useTvsDisplayControlsContext must be used within a TvsDisplayControlsContextProvider',
    )
  }

  return context
}

export function TvsDisplayControlsContextProvider({
  children,
  initialValues,
}: {
  children: React.ReactNode
  initialValues: TvsDisplayControlsState
}) {
  const [state, setState] = useState<TvsDisplayControlsState>(initialValues)

  const setDisplay = useCallback(
    (key: TvsDisplayOptionsKey, value: boolean) => {
      setState((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  return (
    <TvsDisplayControlsContext.Provider
      value={{
        display: state,
        setDisplay,
      }}
    >
      {children}
    </TvsDisplayControlsContext.Provider>
  )
}
