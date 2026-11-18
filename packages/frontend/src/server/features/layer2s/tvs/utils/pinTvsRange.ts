import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ChartRange } from '~/utils/range/range'

/**
 * Moves the whole range back so it ends at the pin. Shifting both ends, not
 * just clamping the end, keeps a "7D" chart seven days long. The start moves
 * by whole days, so it stays on the generated axis at every resolution.
 */
export function pinTvsRange(
  range: ChartRange,
  pin = env.TVS_CHARTS_PINNED_TO,
): ChartRange {
  if (pin === undefined || range[1] <= pin) {
    return range
  }
  const shift =
    UnixTime.toStartOf(range[1], 'day') - UnixTime.toStartOf(pin, 'day')
  return [range[0] === null ? null : range[0] - shift, pin]
}
