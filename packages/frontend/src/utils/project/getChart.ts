import { Bridge, Layer2, safeGetTokenByAssetId } from '@l2beat/config'
import {
  ActivityApiResponse,
  AssetId,
  AssetType,
  ChainId,
  DetailedTvlApiResponse,
  ProjectId,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../build/config'
import { ChartProps } from '../../components'
import { TokenControl } from '../../components/chart/CommonTokenControls'
import { TokenInfo } from '../../scripts/charts/types'
import { unifyTokensResponse } from '../tvl/getTvlStats'

export function getChart(
  project: Layer2 | Bridge,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  config?: Config,
  activityApiResponse?: ActivityApiResponse,
): ChartProps {
  return {
    settingsId: `project-${project.display.slug}`,
    initialType:
      config?.features.detailedTvl && project.type === 'layer2'
        ? { type: 'project-detailed-tvl', slug: project.display.slug }
        : { type: 'project-tvl', slug: project.display.slug },
    tokens: getTokens(project.id, tvlApiResponse, project.type === 'layer2'),
    tvlBreakdownHref: `/scaling/projects/${project.display.slug}/tvl-breakdown`,
    hasActivity:
      config?.features.activity &&
      !!activityApiResponse?.projects[project.id.toString()],
    milestones: project.milestones,
    isUpcoming: project.isUpcoming ?? project.config.escrows.length === 0,
  }
}

export function getTokens(
  projectId: ProjectId,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  isLayer2: boolean,
): TokenControl[] {
  const tokens = tvlApiResponse.projects[projectId.toString()]?.tokens

  const compatibleTokenList = unifyTokensResponse(tokens)

  return compatibleTokenList
    .map(({ assetId, usdValue, assetType, chainId }) => {
      const token = safeGetTokenByAssetId(assetId)
      let symbol = token?.symbol
      if (symbol === 'USDC' && assetType === 'CBV') {
        if (
          projectId.toString() === 'arbitrum' ||
          projectId.toString() === 'optimism'
        ) {
          symbol = 'USDC.e'
        } else if (projectId.toString() === 'base') {
          symbol = 'USDbC'
        }
      }
      const name = token?.name
      const address = token?.address
      const iconUrl = token?.iconUrl ?? ''

      if (symbol && name) {
        return {
          address: address?.toString(),
          iconUrl,
          symbol,
          name,
          info: getTokenInfo(projectId, assetId, assetType, chainId, isLayer2),
          tvl: usdValue,
        }
      }
    })
    .filter(notUndefined)
    .sort((a, b) => b.tvl - a.tvl)
}

function getTokenInfo(
  projectId: ProjectId,
  assetId: AssetId,
  assetType: AssetType,
  chainId: ChainId,
  isLayer2: boolean,
): TokenInfo | TokenInfo {
  if (!isLayer2) {
    return {
      type: 'regular',
      projectId: projectId.toString(),
      assetId: assetId.toString(),
    }
  }
  return assetType === 'CBV'
    ? {
        type: 'CBV',
        projectId: projectId.toString(),
        assetId: assetId.toString(),
      }
    : {
        type: assetType === 'EBV' ? 'EBV' : 'NMV',
        projectId: projectId.toString(),
        assetId: assetId.toString(),
        chainId: chainId.valueOf(),
      }
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
