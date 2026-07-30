import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'

export function getFullySyncedDaRange(range: ChartRange): ChartRange {
  const startOfToday = UnixTime.toStartOf(UnixTime.now(), 'day')
  return [range[0], Math.min(range[1], startOfToday)]
}
