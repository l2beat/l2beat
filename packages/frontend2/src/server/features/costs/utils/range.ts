import { UnixTime } from '@l2beat/shared-pure'
import { z } from 'zod'

export const CostsTimeRange = z.union([
  z.literal('1d'),
  z.literal('7d'),
  z.literal('30d'),
  z.literal('90d'),
  z.literal('180d'),
])
export type CostsTimeRange = z.infer<typeof CostsTimeRange>

export function getRange(range: CostsTimeRange): [UnixTime, UnixTime] {
  const days = rangeToDays(range)
  const resolution = rangeToResolution(range)

  const nowToFullHour = UnixTime.now().toStartOf(
    resolution === 'daily' ? 'day' : 'hour',
  )

  const start = nowToFullHour.add(-days, 'days')
  const end = nowToFullHour

  return [start, end]
}

function rangeToDays(value: CostsTimeRange) {
  return parseInt(value.slice(0, -1))
}

export function rangeToResolution(value: CostsTimeRange) {
  const days = rangeToDays(value)
  if (days < 30) {
    return 'hourly'
  }

  return 'daily'
}
