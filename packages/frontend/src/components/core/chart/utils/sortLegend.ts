import type { ChartMeta } from '../Chart'

/**
 * Sorts legend payload items based on the order of keys in the chartMeta object
 * @returns Sorted payload array
 */
export function sortLegend<T>(
  chartMeta: ChartMeta,
  payload: T[],
  nameKey?: string,
): T[] {
  const metaKeys = Object.keys(chartMeta)

  return [...payload].sort((a, b) => {
    const aItem = a as Record<string, unknown>
    const bItem = b as Record<string, unknown>

    const keyA = `${nameKey ?? aItem.dataKey ?? 'value'}`
    const keyB = `${nameKey ?? bItem.dataKey ?? 'value'}`

    const indexA = metaKeys.indexOf(keyA)
    const indexB = metaKeys.indexOf(keyB)

    // If both keys are found in chartMeta, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    // If only one key is found, prioritize it
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    // If neither key is found, maintain original order
    return 0
  })
}
