import { DetailedTvlApiCharts, TvlApiCharts } from '@l2beat/shared-pure'

import { getPercentageChange } from '../utils'

export function getTvlWithChange(
  charts: TvlApiCharts | DetailedTvlApiCharts | undefined,
) {
  const data = charts?.hourly.data ?? []
  const tvl = data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = data[0][1]
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  return { tvl, tvlWeeklyChange }
}

export function getDetailedTvlWithChange(
  charts: TvlApiCharts | DetailedTvlApiCharts | undefined,
) {
  const data = charts?.hourly.data ?? []
  const parts = {
    tvl: data.at(-1)?.[1] ?? 0,
    cbv: data.at(-1)?.[2] ?? 0,
    ebv: data.at(-1)?.[3] ?? 0,
    nmv: data.at(-1)?.[4] ?? 0,
  }
  const partsSevenDaysAgo = {
    tvl: data[0][1],
    cbv: data[0][2],
    ebv: data[0][3] ?? 0,
    nmv: data[0][4] ?? 0,
  }
  const partsWeeklyChange = {
    tvl: getPercentageChange(parts.tvl, partsSevenDaysAgo.tvl),
    cbv: getPercentageChange(parts.cbv, partsSevenDaysAgo.cbv),
    ebv: getPercentageChange(parts.ebv, partsSevenDaysAgo.ebv),
    nmv: getPercentageChange(parts.nmv, partsSevenDaysAgo.nmv),
  }
  return { parts, partsWeeklyChange }
}
