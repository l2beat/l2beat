import { getSortingOrder } from '../../../../utils/getOrder'
import { ScalingTvlViewEntry, ScalingTvlViewSortingOrder } from '../types'

export function getScalingTvlViewSortingOrder(
  entry: ScalingTvlViewEntry[],
): ScalingTvlViewSortingOrder {
  return {
    name: getSortingOrder(entry, (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    ),
    stage: getSortingOrder(entry, (a, b) =>
      a.stage.stage.toLowerCase().localeCompare(b.stage.stage.toLowerCase()),
    ),
    tvl: getSortingOrder(entry, (a, b) => {
      const aTvl = parseFloat(a.tvl ?? '0')
      const bTvl = parseFloat(b.tvl ?? '0')
      return bTvl - aTvl
    }),
  }
}
