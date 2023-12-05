import { Bridge, Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import {
  getProjectSortingOrder,
  getSortingOrderByTvl,
} from '../../../../utils/getOrder'
import { getTvlRangeData } from '../../../../utils/tvl/getTvlStats'
import { BridgesTvlViewSortingOrder } from '../types'

export function getBridgesTvlViewSortingOrder(
  projects: (Layer2 | Bridge)[],
  tvlApiResponse: TvlApiResponse,
): BridgesTvlViewSortingOrder {
  return {
    name: getProjectSortingOrder(projects, (a, b) =>
      a.display.name.toLowerCase().localeCompare(b.display.name.toLowerCase()),
    ),
    tvl: getSortingOrderByTvl(projects, tvlApiResponse, 'valueUsd'),
    sevenDayChange: getProjectSortingOrder(projects, (a, b) => {
      const aProject = tvlApiResponse.projects[a.id.toString()]
      const bProject = tvlApiResponse.projects[b.id.toString()]
      if (!aProject || !bProject) {
        throw new Error('Only included projects should be sorted')
      }

      const { latestTvl: aLatestTvl, sevenDaysAgo: aSevenDaysAgo } =
        getTvlRangeData(aProject)
      const { latestTvl: bLatestTvl, sevenDaysAgo: bSevenDaysAgo } =
        getTvlRangeData(bProject)

      const aChange = aLatestTvl / aSevenDaysAgo - 1
      const bChange = bLatestTvl / bSevenDaysAgo - 1

      return bChange - aChange
    }),
    validatedBy: getProjectSortingOrder(projects, (a, b) => {
      if (b.riskView?.validatedBy?.value === undefined) {
        return 1
      }

      if (a.riskView?.validatedBy?.value === undefined) {
        return -1
      }

      return a.riskView.validatedBy.value
        .toLowerCase()
        .localeCompare(b.riskView.validatedBy.value.toLowerCase())
    }),
    type: getProjectSortingOrder(projects, (a, b) =>
      a.display.category
        .toLowerCase()
        .localeCompare(b.display.category.toLowerCase()),
    ),
  }
}
