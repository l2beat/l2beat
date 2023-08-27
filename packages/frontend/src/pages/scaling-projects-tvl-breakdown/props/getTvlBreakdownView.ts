import { Layer2 } from '@l2beat/config'
import { TvlBreakdownHeaderProps } from '../view/TvlBreakdownHeader'
import {
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'
import {
  getDetailedTvlWithChange,
  getTvlWithChange,
} from '../../../utils/tvl/getTvlWitchChange'
import { TvlBreakdownViewProps } from '../view/TvlBreakdownView'
import { formatUSD } from '../../../utils/utils'

export function getTvlBreakdownView(
  project: Layer2,
  tvlApiResponse: TvlApiResponse | DetailedTvlApiResponse,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined,
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
  }
}
