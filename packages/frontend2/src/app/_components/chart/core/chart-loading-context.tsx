import { type ReactNode, createContext, useContext, useState } from 'react'

const ChartLoadingContext = createContext<boolean>(false)
const ChartSetLoadingContext = createContext<(loading: boolean) => void>(
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  () => {},
)

export function ChartLoadingContextProvider({
  children,
}: { children?: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(true)

  return (
    <ChartLoadingContext.Provider value={loading}>
      <ChartSetLoadingContext.Provider value={setLoading}>
        {children}
      </ChartSetLoadingContext.Provider>
    </ChartLoadingContext.Provider>
  )
}

export function useChartLoading() {
  const context = useContext(ChartLoadingContext)
  return context
}

export function useChartSetLoading() {
  const context = useContext(ChartSetLoadingContext)
  return context
}
