import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { ChartRange } from '~/utils/range/range'

/**
 * Moves the whole range back so it ends at the pin. Shifting both ends, not
 * just clamping the end, keeps a "7D" chart seven days long and a picked day
 * one day long. The start lands on a day boundary, so it stays on the
 * generated axis at every resolution.
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
  // Presets end partway through today and picked days end at 23:59:59, so
  // count whole days with that last second added back.
  const wholeDays = UnixTime.toStartOf(range[1] - range[0] + 1, 'day')
  return [UnixTime.toStartOf(pin, 'day') - wholeDays, pin]
}
