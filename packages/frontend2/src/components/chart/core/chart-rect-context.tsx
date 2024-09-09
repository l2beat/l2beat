import { createContext, useContext, useState } from 'react'

interface ChartRectContextValue {
  rect: DOMRect | undefined
  setRect: (rect: DOMRect | undefined) => void
}

const ChartRectContext = createContext<ChartRectContextValue | null>(null)

export function ChartRectContextProvider({
  children,
}: { children: React.ReactNode }) {
  const [rect, setRect] = useState<DOMRect>()

  return (
    <ChartRectContext.Provider value={{ rect, setRect }}>
      {children}
    </ChartRectContext.Provider>
  )
}

export function useChartRect() {
  const context = useContext(ChartRectContext)
  if (!context) {
    throw new Error('useChartRect must be used within a ChartRectProvider')
  }
  return context
}
