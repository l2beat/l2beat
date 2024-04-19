import { Bridge, Layer2, Layer3, safeGetTokenByAssetId } from '@l2beat/config'
import {
  ActivityApiResponse,
  AssetId,
  AssetType,
  ChainId,
  L2CostsApiResponse,
  ProjectId,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { Config } from '../../../build/config'
import { ChartProps } from '../../../components'
import { TokenControl } from '../../../components/chart/TokenControls'
import { TokenInfo } from '../../../scripts/charts/types'
import { unifyTokensResponse } from '../../../utils/tvl/getTvlStats'

export interface ProjectDetailsCharts {
  tvl: ChartProps | undefined
  activity: ChartProps | undefined
  costs: ChartProps | undefined
}

export function getCharts(
  project: Layer2 | Layer3 | Bridge,
  tvlApiResponse: TvlApiResponse,
  config: Config,
  activityApiResponse?: ActivityApiResponse,
  costsApiResponse?: L2CostsApiResponse,
): ProjectDetailsCharts {
  const hasTvl =
    project.config.escrows.length !== 0 &&
    !!tvlApiResponse.projects[project.id.toString()]
  const hasActivity =
    !!config?.features.activity &&
    !!activityApiResponse?.projects[project.id.toString()]
  const hasCosts = !!costsApiResponse?.projects[project.id.toString()]

  return {
    tvl: hasTvl
      ? {
          settingsId: `project-${project.display.slug}-tvl`,
          initialType:
            project.type === 'bridge'
              ? { type: 'project-tvl', slug: project.display.slug }
              : { type: 'project-detailed-tvl', slug: project.display.slug },
          tokens: getTokens(
            project.id,
            tvlApiResponse,
            project.type === 'layer2',
          ),
          tvlBreakdownHref:
            (project.type === 'layer2' || project.type === 'layer3') &&
            !project.isUpcoming
              ? `/scaling/projects/${project.display.slug}/tvl-breakdown`
              : undefined,
          milestones: project.milestones,
          showComingSoon: !hasTvl && !hasActivity,
        }
      : undefined,
    activity: hasActivity
      ? {
          settingsId: `project-${project.display.slug}-activity`,
          initialType: { type: 'project-activity', slug: project.display.slug },
          milestones: project.milestones,
        }
      : undefined,
    costs: hasCosts
      ? {
          settingsId: `project-${project.display.slug}-costs`,
          initialType: { type: 'project-costs', slug: project.display.slug },
          milestones: project.milestones,
        }
      : undefined,
  }
}

export function getTokens(
  projectId: ProjectId,
  tvlApiResponse: TvlApiResponse,
  isLayer2orLayer3: boolean,
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
          name,
          info: getTokenInfo(
            projectId,
            assetId,
            assetType,
            chainId,
            symbol,
            isLayer2orLayer3,
          ),
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
  symbol: string,
  isLayer2orLayer3: boolean,
): TokenInfo {
  if (!isLayer2orLayer3) {
    return {
      type: 'regular',
      projectId: projectId.toString(),
      assetId: assetId.toString(),
      symbol,
    }
  }
  return assetType === 'CBV'
    ? {
        type: 'CBV',
        projectId: projectId.toString(),
        assetId: assetId.toString(),
        symbol,
      }
    : {
        type: assetType === 'EBV' ? 'EBV' : 'NMV',
        projectId: projectId.toString(),
        assetId: assetId.toString(),
        chainId: chainId.valueOf(),
        symbol,
      }
}

function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined
}
