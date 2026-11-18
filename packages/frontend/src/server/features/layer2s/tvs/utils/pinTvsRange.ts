import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ChartRange } from '~/utils/range/range'

/**
 * Moves the whole range back so it ends at the pin. Shifting both ends, not
 * just clamping the end, keeps a "7D" chart seven days long. The start stays
 * on a day boundary so it lands on the generated axis at every resolution.
 */
export function pinTvsRange(
  range: ChartRange,
  pin = env.TVS_CHARTS_PINNED_TO,
): ChartRange {
  if (pin === undefined || range[1] <= pin) {
    return range
  }
  const shift = range[1] - pin
  const start =
    range[0] === null ? null : UnixTime.toStartOf(range[0] - shift, 'day')
  return [start, pin]
}
