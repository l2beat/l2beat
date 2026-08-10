import { generateAccessibleColors } from '~/utils/generateColors'

/**
 * The single source of the compare page per-series color mapping, assigned
 * by selection order. The selection chips, chart lines, legend and tooltip
 * must all read colors from this mapping so they always agree.
 */
export function getCompareSeriesColors(
  projectIds: string[],
): Record<string, string> {
  const colors = generateAccessibleColors(projectIds.length)
  return Object.fromEntries(
    projectIds.map((id, index) => [id, colors[index] ?? 'var(--secondary)']),
  )
}
