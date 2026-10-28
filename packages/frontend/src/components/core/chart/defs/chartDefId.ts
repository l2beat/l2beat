import { createContext, useContext } from 'react'

/**
 * Prefixes the ids of one chart's gradients and patterns. `url(#id)` paints
 * with the first element in the page that has the id, so charts sharing ids
 * would paint with each other's, and not at all when that element sits in a
 * layout hidden at the current breakpoint.
 */
export const ChartDefIdPrefix = createContext('')

export function useChartDefId(id: string) {
  return useContext(ChartDefIdPrefix) + id
}

/** Points a `url(#id)` paint at the chart's own, prefixed definition. */
export function scopePaint<T extends string | undefined>(
  paint: T,
  prefix: string,
): T {
  return paint?.replace(/^url\(#(.+)\)$/, `url(#${prefix}$1)`) as T
}
