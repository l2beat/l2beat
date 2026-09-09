import { createContext, type ReactNode, useContext } from 'react'

/**
 * Whether the enclosing chart card is the hovered one. Defaults to `true` so
 * a chart rendered outside a card (no provider) behaves like a standalone
 * chart and always shows its tooltip.
 */
const CompareChartHoveredContext = createContext(true)

/**
 * Tells the chart inside a card whether that card is the one under the
 * pointer (or no card is). Recharts' sync activates the tooltip on every
 * chart at once; followers receive `false` and render only the crosshair, so
 * one full tooltip shows per hover. The page owns the hovered-card state and
 * each card provides its own boolean here.
 */
export function CompareChartHoveredProvider({
  isHovered,
  children,
}: {
  isHovered: boolean
  children: ReactNode
}) {
  return (
    <CompareChartHoveredContext.Provider value={isHovered}>
      {children}
    </CompareChartHoveredContext.Provider>
  )
}

export function useIsCompareChartHovered() {
  return useContext(CompareChartHoveredContext)
}
