import { Layer2 } from '@l2beat/config'
import { ProjectAssetsBreakdownApiResponse } from '@l2beat/shared-pure'

import { formatTimestampToDateWithHour } from '../../../../utils'
import { TvlBreakdownHeaderProps } from '../view/TvlBreakdownHeader'

export function getTvlBreakdownHeader(
  project: Layer2,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse,
): TvlBreakdownHeaderProps {
  return {
    slug: project.display.slug,
    title: project.display.name,
    tvlBreakdownDate: formatTimestampToDateWithHour(
      tvlBreakdownApiResponse.dataTimestamp,
    ),
  }
}
