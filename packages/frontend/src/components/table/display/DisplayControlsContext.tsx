import { assert } from '@l2beat/shared-pure'
import { createContext, useCallback, useContext, useState } from 'react'
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

  const getDisplay = useCallback(
    (key: DisplayOptionsKey): boolean => {
      const value = state[key]
      assert(
        value !== undefined,
        `DisplayControlsContext.ts: "${key}" was not provided in initialValues`,
      )
      return value
    },
    [state],
  )

  const setDisplay = useCallback((key: DisplayOptionsKey, value: boolean) => {
    setState((prev) => {
      assert(
        prev[key] !== undefined,
        `DisplayControlsContext.ts: "${key}" was not provided in initialValues`,
      )
      return { ...prev, [key]: value }
    })
  }, [])

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
