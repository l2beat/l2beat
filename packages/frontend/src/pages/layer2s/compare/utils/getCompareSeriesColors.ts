import { ProjectId } from '@l2beat/shared-pure'
import { generateAccessibleColors } from '~/utils/generateColors'

const ETHEREUM_COLOR = 'var(--chart-ethereum)'

/**
 * The single source of the compare page per-series color mapping, assigned
 * by selection order. The selection chips, chart lines, legend and tooltip
 * must all read colors from this mapping so they always agree.
 *
 * Ethereum always gets the site-wide Ethereum chart color and takes no
 * palette slot, so the projects around it keep the colors they would have
 * without it.
 */
export function getCompareSeriesColors(
  projectIds: string[],
): Record<string, string> {
  const paletteIds = projectIds.filter((id) => id !== ProjectId.ETHEREUM)
  const colors = generateAccessibleColors(paletteIds.length)
  return {
    ...Object.fromEntries(
      paletteIds.map((id, index) => [id, colors[index] ?? 'var(--secondary)']),
    ),
    ...(projectIds.includes(ProjectId.ETHEREUM)
      ? { [ProjectId.ETHEREUM]: ETHEREUM_COLOR }
      : {}),
  }
}
