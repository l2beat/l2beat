import { TvlApiProject, TvlApiToken } from '@l2beat/shared-pure'

import { getPercentageChange } from '../utils'
import { getTvlBreakdown } from './getTVLBreakdown'

export type TvlStats = ReturnType<typeof getTvlStats>

export function getTvlStats(
  tvlProject: TvlApiProject,
  name: string,
  associatedTokens: string[],
) {
  const { latestTvl, oneDayAgo, sevenDaysAgo } = getTvlRangeData(tvlProject)

  return {
    latestTvl,
    tvlBreakdown: getTvlBreakdown(
      name,
      associatedTokens,
      latestTvl,
      unifyTokensResponse(tvlProject.tokens),
    ),
    oneDayChange: getPercentageChange(latestTvl, oneDayAgo),
    sevenDayChange: getPercentageChange(latestTvl, sevenDaysAgo),
  }
}

export function getTvlRangeData(tvlProject: TvlApiProject) {
  const hourlyData = tvlProject.charts.hourly.data
  const latestTvl = hourlyData.at(-1)?.[1] ?? 0
  const oneDayAgo = hourlyData.at(-25)?.[1] ?? 0
  // This assumes that hourly data spans exactly 7 days
  const sevenDaysAgo = hourlyData.at(0)?.[1] ?? 0
  return {
    latestTvl,
    oneDayAgo,
    sevenDaysAgo,
  }
}

/**
 * Backwards compatibility for classic TVL API response
 * @notice Remove once classic TVL API is deprecated
 */
export function unifyTokensResponse(
  tokens?: TvlApiProject['tokens'],
): TvlApiToken[] {
  if (!tokens) {
    return []
  }

  return Object.values(tokens)
    .flat()
    .map((token) => ({
      assetId: token.assetId,
      chainId: token.chainId,
      assetType: token.assetType,
      usdValue: token.usdValue,
    }))
}
