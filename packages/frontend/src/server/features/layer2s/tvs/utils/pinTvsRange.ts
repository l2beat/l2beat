import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ChartRange } from '~/utils/range/range'

/**
 * Moves the whole range back so it ends at the pin. Shifting both ends, not
 * just clamping the end, keeps a "7D" chart seven days long and a single
 * picked day one day long. The start lands on the nearest day boundary, so it
 * stays on the generated axis at every resolution.
 */
export function pinTvsRange(
  range: ChartRange,
  pin = env.TVS_CHARTS_PINNED_TO,
): ChartRange {
  if (pin === undefined || range[1] <= pin) {
    return range
  }
  if (range[0] === null) {
    return [null, pin]
  }
  const shiftedStart = pin - (range[1] - range[0])
  return [UnixTime.toStartOf(shiftedStart + 12 * UnixTime.HOUR, 'day'), pin]
}
