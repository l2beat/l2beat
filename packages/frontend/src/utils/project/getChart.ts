import { Bridge, Layer2, safeGetTokenByAssetId } from '@l2beat/config'
import {
  ActivityApiResponse,
  DetailedTvlApiResponse,
  ProjectId,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../build/config'
import { ChartProps } from '../../components'
import { TokenControl } from '../../components/chart/CommonTokenControls'
import { unifyTokensResponse } from '../tvl/getTvlStats'

export function getChart(
  project: Layer2 | Bridge,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  config?: Config,
  activityApiResponse?: ActivityApiResponse,
): ChartProps {
  return {
    tvlEndpoint: `/api/${project.display.slug}-tvl.json`,
    detailedTvlEndpoint: `/api/${project.display.slug}-detailed-tvl.json`,
    activityEndpoint: `/api/activity/${project.display.slug}.json`,
    tokens: getTokens(
      project.id,
      tvlApiResponse,
      config?.features.detailedTvl ?? false,
    ),
    hasActivity:
      config?.features.activity &&
      !!activityApiResponse?.projects[project.id.toString()],
    hasDetailedTvl: config?.features.detailedTvl,
    milestones: config?.features.milestones ? project.milestones : [],
    isUpcoming: project.isUpcoming ?? project.config.escrows.length === 0,
  }
}

function getTokens(
  projectId: ProjectId,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  hasDetailedTVL: boolean,
): TokenControl[] {
  const tokens = tvlApiResponse.projects[projectId.toString()]?.tokens

  const compatibleTokenList = unifyTokensResponse(tokens)

  return compatibleTokenList
    .map(({ assetId, usdValue, assetType, chainId }) => {
      const token = safeGetTokenByAssetId(assetId)
      const symbol = token?.symbol
      const name = token?.name
      const address = token?.address

      if (symbol && name) {
        const tvlEndpoint = hasDetailedTVL
          ? `/api/projects/${projectId.toString()}/tvl/chains/${chainId.toString()}/assets/${assetId.toString()}/types/${assetType}`
          : `/api/projects/${projectId.toString()}/tvl/assets/${assetId.toString()}`

        return {
          address: address?.toString(),
          symbol,
          name,
          assetType,
          tvlEndpoint,
          tvl: usdValue,
        }
      }
    })
    .filter(notUndefined)
    .sort((a, b) => b.tvl - a.tvl)
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
