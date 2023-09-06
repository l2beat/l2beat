import { DetailedTvlApiCharts, TvlApiCharts } from '@l2beat/shared-pure'

import { getPercentageChange } from '../utils'

export function getTvlWithChange(
  charts: TvlApiCharts | DetailedTvlApiCharts | undefined,
) {
  const data = charts?.hourly.data ?? []
  const tvl = data.at(-1)?.[1] ?? 0
  const tvlSevenDaysAgo = data.at(0)?.[1] ?? 0
  const tvlWeeklyChange = getPercentageChange(tvl, tvlSevenDaysAgo)
  return { tvl, tvlWeeklyChange }
}

export function getDetailedTvlWithChange(
  charts: TvlApiCharts | DetailedTvlApiCharts | undefined,
) {
  const data = charts?.hourly.data ?? []
  const parts = {
    tvl: data.at(-1)?.[1] ?? 0,
    canonical: data.at(-1)?.[2] ?? 0,
    external: data.at(-1)?.[3] ?? 0,
    native: data.at(-1)?.[4] ?? 0,
  }
  const partsSevenDaysAgo = {
    tvl: data.at(0)?.[1] ?? 0,
    canonical: data.at(0)?.[2] ?? 0,
    external: data.at(0)?.[3] ?? 0,
    native: data.at(0)?.[4] ?? 0,
  }
  const partsWeeklyChange = {
    tvl: getPercentageChange(parts.tvl, partsSevenDaysAgo.tvl),
    canonical: getPercentageChange(
      parts.canonical,
      partsSevenDaysAgo.canonical,
    ),
    external: getPercentageChange(parts.external, partsSevenDaysAgo.external),
    native: getPercentageChange(parts.native, partsSevenDaysAgo.native),
  }
  return { parts, partsWeeklyChange }
}
