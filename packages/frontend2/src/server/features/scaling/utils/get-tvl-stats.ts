import { type TvlApiToken } from '@l2beat/shared-pure'
import { type TokenBreakdownProps } from '~/app/_components/breakdown/token-breakdown'
import { getPercentageChange } from '~/utils/get-percentage-change'
import { type TvlProject } from '../get-tvl'
import { getTvlBreakdown } from './get-tvl-breakdown'

export type TvlStats = {
  latestTvl: number
  tvlBreakdown: TokenBreakdownProps
  sevenDayChange: string
}

export function getTvlStats(
  tvlProject: TvlProject,
  name: string,
  associatedTokens: string[],
): TvlStats {
  const { latestTvl, sevenDaysAgo } = getTvlRangeData(tvlProject)

  return {
    latestTvl,
    tvlBreakdown: getTvlBreakdown(
      name,
      associatedTokens,
      latestTvl,
      unifyTokensResponse(tvlProject.tokens),
    ),
    sevenDayChange: getPercentageChange(latestTvl, sevenDaysAgo),
  }
}

export function getTvlRangeData(tvlProject: TvlProject) {
  const hourlyData = tvlProject.charts.hourly.data
  const latestTvl = hourlyData.at(-1)?.[1] ?? 0
  // This assumes that hourly data spans exactly 7 days
  const sevenDaysAgo = hourlyData.at(0)?.[1] ?? 0
  return {
    latestTvl,
    sevenDaysAgo,
  }
}

/**
 * Backwards compatibility for classic TVL API response
 * @notice Remove once classic TVL API is deprecated
 */
export function unifyTokensResponse(
  tokens?: TvlProject['tokens'],
): TvlApiToken[] {
  if (!tokens) {
    return []
  }

  return Object.values(tokens)
    .flat()
    .map((token) => ({
      assetId: token.assetId,
      chainId: token.chainId,
      source: token.source,
      usdValue: token.usdValue,
      chain: token.chain,
      address: token.address,
    }))
}
