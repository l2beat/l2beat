import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react'

interface CompareChartHoverContextType {
  /** Index of the chart card the pointer is currently over, if any. */
  hoveredChartId: number | undefined
  setHoveredChartId: (chartId: number | undefined) => void
}

const CompareChartHoverContext = createContext<CompareChartHoverContextType>({
  hoveredChartId: undefined,
  setHoveredChartId: () => {},
})

/**
 * Tracks which chart card the pointer is over. Recharts' sync activates the
 * tooltip on every chart at once; this tells each chart whether it is the
 * hovered one (full tooltip) or a follower (crosshair only).
 */
export function CompareChartHoverProvider({
  children,
}: {
  children: ReactNode
}) {
  const [hoveredChartId, setHoveredChartId] = useState<number>()
  const value = useMemo(
    () => ({ hoveredChartId, setHoveredChartId }),
    [hoveredChartId],
  )
  return (
    <CompareChartHoverContext.Provider value={value}>
      {children}
    </CompareChartHoverContext.Provider>
  )
}

export function useCompareChartHover() {
  return useContext(CompareChartHoverContext)
}

/** The id a chart card gives to everything rendered inside it. */
const CompareChartIdContext = createContext<number | undefined>(undefined)

export function CompareChartIdProvider({
  chartId,
  children,
}: {
  chartId: number
  children: ReactNode
}) {
  return (
    <CompareChartIdContext.Provider value={chartId}>
      {children}
    </CompareChartIdContext.Provider>
  )
}

export function useCompareChartId() {
  return useContext(CompareChartIdContext)
}
