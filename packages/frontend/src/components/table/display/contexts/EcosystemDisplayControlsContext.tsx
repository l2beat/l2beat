import { createContext, useCallback, useContext, useState } from 'react'
import type { DISPLAY_OPTIONS } from '../displayOptions'

type EcosystemDisplayOptionsKey = Extract<
  keyof typeof DISPLAY_OPTIONS,
  'excludeRwaRestrictedTokens'
>

type EcosystemDisplayControlsState = Record<EcosystemDisplayOptionsKey, boolean>

type EcosystemDisplayControlsContextValue = {
  display: EcosystemDisplayControlsState
  setDisplay: (key: EcosystemDisplayOptionsKey, value: boolean) => void
}

const EcosystemDisplayControlsContext = createContext<
  EcosystemDisplayControlsContextValue | undefined
>(undefined)

export function useEcosystemDisplayControlsContext() {
  const context = useContext(EcosystemDisplayControlsContext)
  if (!context) {
    throw new Error(
      'useEcosystemDisplayControlsContext must be used within a EcosystemDisplayControlsContextProvider',
    )
  }

  return context
}

export function EcosystemDisplayControlsContextProvider({
  children,
  initialValues,
}: {
  children: React.ReactNode
  initialValues: EcosystemDisplayControlsState
}) {
  const [state, setState] =
    useState<EcosystemDisplayControlsState>(initialValues)

  const setDisplay = useCallback(
    (key: EcosystemDisplayOptionsKey, value: boolean) => {
      setState((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  return (
    <EcosystemDisplayControlsContext.Provider
      value={{
        display: state,
        setDisplay,
      }}
    >
      {children}
    </EcosystemDisplayControlsContext.Provider>
  )
}
