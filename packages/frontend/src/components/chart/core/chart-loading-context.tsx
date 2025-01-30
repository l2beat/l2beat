import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export interface ChartLoadingContextProviderParams {
  isLoading: boolean
  children?: ReactNode
}

const ChartLoadingContext = createContext<boolean>(false)

export function ChartLoadingContextProvider({
  children,
  isLoading,
}: ChartLoadingContextProviderParams) {
  return (
    <ChartLoadingContext.Provider value={isLoading}>
      {children}
    </ChartLoadingContext.Provider>
  )
}

export function useChartLoading() {
  const context = useContext(ChartLoadingContext)
  return context
}
