'use client'

import { type DaBridge, type DaLayer } from '@l2beat/config'
import { createContext, useContext } from 'react'

type DAProjectContextValue = {
  layer: DaLayer
  bridge: DaBridge
}

const DAProjectContext = createContext<DAProjectContextValue | null>(null)

interface Props {
  children: React.ReactNode
  value: DAProjectContextValue
}

export function DAProjectContextProvider({ children, value }: Props) {
  return (
    <DAProjectContext.Provider value={value}>
      {children}
    </DAProjectContext.Provider>
  )
}

export function useDAProjectContext() {
  const context = useContext(DAProjectContext)
  if (!context) {
    throw new Error('useChartContext must be used within a Chart')
  }
  return context
}
