import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type TvsChartRange = v.infer<typeof TvsChartRange>
export const TvsChartRange = v.object({
  from: v.union([v.number(), v.null()]),
  to: v.number(),
})

export type TvsChartResolution = ReturnType<typeof rangeToResolution>

export function rangeToResolution(range: TvsChartRange) {
  if (range.from === null) return 'daily'
  if (range.from > UnixTime.toStartOf(UnixTime.now(), 'day') - 7 * UnixTime.DAY)
    return 'hourly'
  if (
    range.from >
    UnixTime.toStartOf(UnixTime.now(), 'day') - 90 * UnixTime.DAY
  )
    return 'sixHourly'
  return 'daily'
}
