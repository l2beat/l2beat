import { Layer2 } from '@l2beat/config'
import { TvlBreakdownHeaderProps } from '../view/TvlBreakdownHeader'
import {
  DetailedTvlApiResponse,
  ProjectAssetsBreakdownApiResponse,
  TvlApiResponse,
} from '@l2beat/shared-pure'

export function getTvlBreakdownHeader(
  project: Layer2,
  tvlBreakdownApiResponse: ProjectAssetsBreakdownApiResponse | undefined,
): TvlBreakdownHeaderProps {
  const date = tvlBreakdownApiResponse?.dataTimestamp.toDate() || new Date()
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
