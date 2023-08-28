import { Layer2 } from '@l2beat/config'
import { ProjectAssetsBreakdownApiResponse } from '@l2beat/shared-pure'

import { TvlBreakdownHeaderProps } from '../view/TvlBreakdownHeader'

export function getTvlBreakdownHeader(
  project: Layer2,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse,
): TvlBreakdownHeaderProps {
  const date = tvlBreakdownApiResponse.dataTimestamp.toDate()
  const month = date.getMonth() + 1
  const tvlBreakdownDate = `${date.getFullYear()}-${
    month.toString().length === 1 ? `0${month}` : month
  }-${date.getDate()}`

  return {
    icon: `/icons/${project.display.slug}.png`,
    slug: project.display.slug,
    title: project.display.name,
    tvlBreakdownDate,
  }
}
