import { assert } from '@l2beat/shared-pure'
import { createContext, useContext, useState } from 'react'
import { DISPLAY_OPTIONS } from './displayOptions'

export type DisplayControlsKey = keyof typeof DISPLAY_OPTIONS

type DisplayControlsState = Record<DisplayControlsKey, boolean | undefined>

type DisplayControlsContextValue = {
  displayState: DisplayControlsState
  getDisplay: (key: DisplayControlsKey) => boolean
  setDisplay: (key: DisplayControlsKey, value: boolean) => void
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
  initialValues: Partial<Record<DisplayControlsKey, boolean>>
}) {
  const [state, setState] = useState<DisplayControlsState>(
    () =>
      Object.fromEntries(
        Object.keys(DISPLAY_OPTIONS).map((key) => [
          key,
          initialValues[key as DisplayControlsKey],
        ]),
      ) as DisplayControlsState,
  )

  const getDisplay = (key: DisplayControlsKey): boolean => {
    const value = state[key]
    assert(
      value !== undefined,
      `DisplayControlsContext.ts: "${key}" was not provided in initialValues`,
    )
    return value
  }

  const setDisplay = (key: DisplayControlsKey, value: boolean) => {
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
