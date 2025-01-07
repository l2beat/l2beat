import { z } from 'zod'
import { rangeToDays } from '~/utils/range/range-to-days'

export const TvlChartRange = z.enum(['7d', '30d', '90d', '180d', '1y', 'max'])
export type TvlChartRange = z.infer<typeof TvlChartRange>

export type TvlChartResolution = ReturnType<typeof rangeToResolution>

export function rangeToResolution(range: TvlChartRange) {
  const days = rangeToDays(range)
  if (days && days <= 7) return 'hourly'
  if (days && days < 180) return 'sixHourly'
  return 'daily'
}

export function getRangeConfig(range: TvlChartRange) {
  const days = rangeToDays(range)
  const resolution = rangeToResolution(range)
  return { days, resolution } as const
}
