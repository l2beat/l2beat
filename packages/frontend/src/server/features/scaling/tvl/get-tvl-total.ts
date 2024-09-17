import { type ChartUnit } from '~/components/chart/types'
import { type TvlChartDataParams, getTvlChartData } from './get-tvl-chart-data'

export async function getTvlChartTotal({
  excludeAssociatedTokens,
  filter,
}: Omit<TvlChartDataParams, 'range'>): Promise<Record<ChartUnit, number>> {
  const chart = await getTvlChartData({
    excludeAssociatedTokens,
    filter,
    range: '7d',
  })

  const latestValue = chart.at(-1)

  if (!latestValue) {
    return {
      usd: 0,
      eth: 0,
    }
  }

  const total = latestValue[1] + latestValue[2] + latestValue[3]
  const ethPrice = latestValue[4]

  return {
    usd: total / 100,
    eth: total / ethPrice,
  }
}
