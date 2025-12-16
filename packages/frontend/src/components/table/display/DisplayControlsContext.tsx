import { assert } from '@l2beat/shared-pure'
import { createContext, useContext, useState } from 'react'
import type { DisplayOptionsKey } from './displayOptions'

type DisplayControlsState = Partial<Record<DisplayOptionsKey, boolean>>

type DisplayControlsContextValue = {
  displayState: DisplayControlsState
  getDisplay: (key: DisplayOptionsKey) => boolean
  setDisplay: (key: DisplayOptionsKey, value: boolean) => void
}

const DisplayControlsContext = createContext<
  DisplayControlsContextValue | undefined
>(undefined)

export function useDisplayControlsContext() {
  const context = useContext(DisplayControlsContext)
  if (!context) {
    throw new Error(
      'useDisplayControlsContext must be used within a DisplayControlsContextProvider',
    )
  }

  return context
}

export function DisplayControlsContextProvider({
  children,
  initialValues,
}: {
  children: React.ReactNode
  initialValues: DisplayControlsState
}) {
  const [state, setState] = useState<DisplayControlsState>(initialValues)

  const getDisplay = (key: DisplayOptionsKey): boolean => {
    const value = state[key]
    assert(
      value !== undefined,
      `DisplayControlsContext.ts: "${key}" was not provided in initialValues`,
    )
    return value
  }

  const setDisplay = (key: DisplayOptionsKey, value: boolean) => {
    assert(
      state[key] !== undefined,
      `DisplayControlsContext.ts: "${key}" was not provided in initialValues`,
    )
    setState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <DisplayControlsContext.Provider
      value={{
        displayState: state,
        getDisplay,
        setDisplay,
      }}
    >
      {children}
    </DisplayControlsContext.Provider>
  )
}
