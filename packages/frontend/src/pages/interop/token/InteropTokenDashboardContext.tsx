import { createContext, type ReactNode, useContext } from 'react'
import type { InteropTokenDashboardData } from '~/server/features/layer2s/interop/getInteropTokenData'
import type { InteropSelection } from '../utils/types'

interface InteropTokenDashboardContextValue {
  data: InteropTokenDashboardData | undefined
  isLoading: boolean
  apiSelection: InteropSelection
  tokenId: string
}

const InteropTokenDashboardContext = createContext<
  InteropTokenDashboardContextValue | undefined
>(undefined)

export function InteropTokenDashboardProvider({
  children,
  ...value
}: InteropTokenDashboardContextValue & { children: ReactNode }) {
  return (
    <InteropTokenDashboardContext.Provider value={value}>
      {children}
    </InteropTokenDashboardContext.Provider>
  )
}

export function useInteropTokenDashboard() {
  const context = useContext(InteropTokenDashboardContext)
  if (!context) {
    throw new Error(
      'useInteropTokenDashboard must be used within InteropTokenDashboardProvider',
    )
  }
  return context
}
