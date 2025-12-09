import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from './range'

export function rangeToDays(range: ChartRange): number | null {
  if (range[0] === null) return null
  return Math.floor((range[1] - range[0]) / UnixTime.DAY)
}
