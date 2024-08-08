import { z } from 'zod'

export const TvlChartRange = z.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
export type TvlChartRange = z.infer<typeof TvlChartRange>

export function rangeToDays(range: TvlChartRange) {
  if (range === 'max') return Infinity
  const count = parseInt(range.substring(0, range.length - 1))
  const unit = range.substring(range.length - 1)

  if (unit === 'd') {
    return count
  }

  if (unit === 'y') {
    return count * 365
  }

  throw new Error('Invalid range')
}

export function rangeToResolution(range: TvlChartRange) {
  const days = rangeToDays(range)
  if (days <= 7) return 'hourly'
  if (days < 180) return 'sixHourly'
  return 'daily'
}

export function getRangeConfig(range: TvlChartRange) {
  const days = rangeToDays(range)
  const resolution = rangeToResolution(range)
  return { days, resolution } as const
}
