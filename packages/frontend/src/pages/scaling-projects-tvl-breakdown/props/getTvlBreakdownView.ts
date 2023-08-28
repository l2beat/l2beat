import { Layer2 } from '@l2beat/config'
import {
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

import { getDetailedTvlWithChange } from '../../../utils/tvl/getTvlWitchChange'
import { formatUSD } from '../../../utils/utils'

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
  tvlBreakdowns: ProjectAssetsBreakdownApiResponse['breakdowns']
}

export function getTvlBreakdownView(
  project: Layer2,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse,
): TvlBreakdownViewProps {
  const apiProject = tvlApiResponse.projects[project.id.toString()]
  const charts = apiProject?.charts
  const { parts, partsWeeklyChange } = getDetailedTvlWithChange(charts)

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
    tvlBreakdowns: tvlBreakdownApiResponse.breakdowns,
  }
}
