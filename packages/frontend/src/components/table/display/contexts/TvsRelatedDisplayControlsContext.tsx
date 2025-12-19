import { createContext, useCallback, useContext, useState } from 'react'
import type { DISPLAY_OPTIONS } from '../displayOptions'

type TvsRelatedDisplayOptionsKey = Extract<
  keyof typeof DISPLAY_OPTIONS,
  'excludeRwaRestrictedTokens' | 'excludeAssociatedTokens'
>

type TvsRelatedDisplayControlsState = Record<
  TvsRelatedDisplayOptionsKey,
  boolean
>

type TvsRelatedDisplayControlsContextValue = {
  display: TvsRelatedDisplayControlsState
  setDisplay: (key: TvsRelatedDisplayOptionsKey, value: boolean) => void
}

const TvsRelatedDisplayControlsContext = createContext<
  TvsRelatedDisplayControlsContextValue | undefined
>(undefined)

export function useTvsRelatedDisplayControlsContext() {
  const context = useContext(TvsRelatedDisplayControlsContext)
  if (!context) {
    throw new Error(
      'useTvsRelatedDisplayControlsContext must be used within a TvsRelatedDisplayControlsContextProvider',
    )
  }

  return context
}

export function TvsRelatedDisplayControlsContextProvider({
  children,
  initialValues,
}: {
  children: React.ReactNode
  initialValues: TvsRelatedDisplayControlsState
}) {
  const [state, setState] =
    useState<TvsRelatedDisplayControlsState>(initialValues)

  const setDisplay = useCallback(
    (key: TvsRelatedDisplayOptionsKey, value: boolean) => {
      setState((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  return (
    <TvsRelatedDisplayControlsContext.Provider
      value={{
        display: state,
        setDisplay,
      }}
    >
      {children}
    </TvsRelatedDisplayControlsContext.Provider>
  )
}
