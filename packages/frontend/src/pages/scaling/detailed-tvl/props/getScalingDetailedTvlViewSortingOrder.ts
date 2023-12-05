import { Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import {
  getProjectSortingOrder,
  getSortingOrderByTvl,
} from '../../../../utils/getOrder'
import { ScalingDetailedTvlViewSortingOrder } from '../types'

export function getScalingDetailedTvlViewSortingOrder(
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
): ScalingDetailedTvlViewSortingOrder {
  return {
    name: getProjectSortingOrder(projects, (a, b) =>
      a.display.name.toLowerCase().localeCompare(b.display.name.toLowerCase()),
    ),
    total: getSortingOrderByTvl(projects, tvlApiResponse, 'valueUsd'),
    external: getSortingOrderByTvl(projects, tvlApiResponse, 'ebvUsd'),
    canonical: getSortingOrderByTvl(projects, tvlApiResponse, 'cbvUsd'),
    native: getSortingOrderByTvl(projects, tvlApiResponse, 'nmvUsd'),
  }
}
