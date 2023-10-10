import { getPercentageChange } from '../../../../utils/utils'
import { AggregateDetailedTvlResponse } from '../../types'

export function getTvlWithChange(
  values: AggregateDetailedTvlResponse,
  currency: 'usd' | 'eth',
) {
  const data = values.hourly.data
  const dataIndex = currency === 'usd' ? 1 : 5
  const tvl = data.at(-1)?.[dataIndex] ?? 0
  const tvlSevenDaysAgo = data.at(0)?.[dataIndex] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  return { tvl, tvlWeeklyChange }
}
