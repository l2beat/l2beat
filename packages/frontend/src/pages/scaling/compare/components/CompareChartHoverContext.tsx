import { createContext, useContext } from 'react'

/**
 * Whether the enclosing chart card is the one under the pointer (or no card
 * is). Recharts' sync activates the tooltip on every chart at once; followers
 * read `false` here and render only the crosshair, so one full tooltip shows
 * per hover. Defaults to `true` so charts outside a card behave normally.
 */
export const CompareChartHoveredContext = createContext(true)

export function useIsCompareChartHovered() {
  return useContext(CompareChartHoveredContext)
}
