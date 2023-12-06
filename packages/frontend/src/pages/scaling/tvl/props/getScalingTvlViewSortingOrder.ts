import { Layer2 } from '@l2beat/config'
import { TvlApiResponse } from '@l2beat/shared-pure'

import {
  getProjectSortingOrder,
  getSortingOrderByTvl,
} from '../../../../utils/getOrder'
import { ScalingTvlViewSortingOrder } from '../types'

export function getScalingTvlViewSortingOrder(
  projects: Layer2[],
  tvlApiResponse: TvlApiResponse,
): ScalingTvlViewSortingOrder {
  return {
    name: getProjectSortingOrder(projects, (a, b) =>
      a.display.name.toLowerCase().localeCompare(b.display.name.toLowerCase()),
    ),
    stage: getProjectSortingOrder(projects, (a, b) =>
      b.stage.stage.toLowerCase().localeCompare(a.stage.stage.toLowerCase()),
    ),
    tvl: getSortingOrderByTvl(projects, tvlApiResponse, 'valueUsd'),
  }
}
