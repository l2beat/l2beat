import { rangeToDays } from '~/utils/range/range-to-days'

export type TvlChartRange = '7d' | '30d' | '90d' | '180d' | '1y' | 'max'

export function rangeToResolution(range: TvlChartRange) {
  const days = rangeToDays(range) ?? Infinity
  if (days <= 7) return 'hourly'
  if (days < 180) return 'sixHourly'
  return 'daily'
}

export function getRangeConfig(range: TvlChartRange) {
  const days = rangeToDays(range)
  const resolution = rangeToResolution(range)
  return { days, resolution } as const
}
