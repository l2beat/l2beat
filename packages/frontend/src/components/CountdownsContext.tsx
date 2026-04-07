import type { PROJECT_COUNTDOWNS } from '@l2beat/config'
import { createContext, useContext } from 'react'

const CountdownsContext = createContext<typeof PROJECT_COUNTDOWNS | null>(null)

interface Props {
  children: React.ReactNode
  countdowns: typeof PROJECT_COUNTDOWNS
}

export function CountdownsContextProvider({ children, countdowns }: Props) {
  return (
    <CountdownsContext.Provider value={countdowns}>
      {children}
    </CountdownsContext.Provider>
  )
}

export function useCountdownsContext() {
  const context = useContext(CountdownsContext)
  if (!context) {
    throw new Error(
      'useCountdownsContext must be used within a CountdownsContextProvider',
    )
  }
  return context
}
