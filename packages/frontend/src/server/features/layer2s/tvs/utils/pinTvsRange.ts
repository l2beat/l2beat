import { env } from '~/env'
import type { ChartRange } from '~/utils/range/range'

/**
 * Moves the whole range back so it ends at the pin and keeps its length.
 * Shifting both ends, not just clamping the end, keeps a "7D" chart seven
 * days long. generateTimestamps snaps the start onto the chart's grid.
 */
export function pinTvsRange(
  range: ChartRange,
  pin = env.TVS_CHARTS_PINNED_TO,
): ChartRange {
  if (pin === undefined || range[1] <= pin) {
    return range
  }
  const shift = range[1] - pin
  return [range[0] === null ? null : range[0] - shift, pin]
}
