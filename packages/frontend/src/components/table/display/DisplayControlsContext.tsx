import { createContext, useContext, useState } from 'react'
import type { DISPLAY_OPTIONS } from './displayOptions'

export type DisplayControlsKey = keyof typeof DISPLAY_OPTIONS

type DisplayControlsState = Partial<Record<DisplayControlsKey, boolean>>

type DisplayControlsContextValue = {
  display: DisplayControlsState
  setDisplay: <K extends DisplayControlsKey>(key: K, value: boolean) => void
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

  const set = <K extends DisplayControlsKey>(key: K, value: boolean) => {
    if (!(key in initialValues)) {
      console.warn(
        `DisplayControlsContext: "${key}" was not provided in initialValues`,
      )
      return
    }
    setState((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <DisplayControlsContext.Provider
      value={{
        display: state,
        setDisplay: set,
      }}
    >
      {children}
    </DisplayControlsContext.Provider>
  )
}
