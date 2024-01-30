import { Layer2 } from '@l2beat/config'
import {
  CanonicalAssetBreakdownData,
  ExternalAssetBreakdownData,
  NativeAssetBreakdownData,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { getExplorerUrlByChainId } from '../../../../utils/getExplorerUrl'
import { getDetailedTvlWithChange } from '../../../../utils/tvl/getTvlWithChange'
import { formatUSD } from '../../../../utils/utils'

export interface TVLProjectBreakdown {
  canonical: (CanonicalAssetBreakdownData & { explorerUrl?: string })[]
  external: (ExternalAssetBreakdownData & { explorerUrl?: string })[]
  native: (NativeAssetBreakdownData & { explorerUrl?: string })[]
}
export interface TvlBreakdownViewProps {
  tvlBreakdownSummary: {
    tvl: {
      value: string
      change: string
    }
    canonical: {
      value: string
      change: string
    }
    external: {
      value: string
      change: string
    }
    native: {
      value: string
      change: string
    }
  }
  tvlBreakdowns: TVLProjectBreakdown
}

export function getTvlBreakdownView(
  project: Layer2,
  tvlApiResponse: TvlApiResponse,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse,
): TvlBreakdownViewProps {
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  const charts = apiProject?.charts
  const { parts, partsWeeklyChange } = getDetailedTvlWithChange(charts)

  const breakdowns = tvlBreakdownApiResponse.breakdowns[project.id.toString()]

  return {
    tvlBreakdownSummary: {
      tvl: {
        value: formatUSD(parts.tvl),
        change: partsWeeklyChange.tvl,
      },
      canonical: {
        value: formatUSD(parts.canonical),
        change: partsWeeklyChange.canonical,
      },
      external: {
        value: formatUSD(parts.external),
        change: partsWeeklyChange.external,
      },
      native: {
        value: formatUSD(parts.native),
        change: partsWeeklyChange.native,
      },
    },
    tvlBreakdowns: {
      canonical: breakdowns.canonical.map((asset) => ({
        ...asset,
        explorerUrl: getExplorerUrlByChainId(asset.chainId),
      })),
      external: breakdowns.external.map((asset) => ({
        ...asset,
        explorerUrl: getExplorerUrlByChainId(asset.chainId),
      })),
      native: breakdowns.native.map((asset) => ({
        ...asset,
        explorerUrl: getExplorerUrlByChainId(asset.chainId),
      })),
    },
  }
}
