import { getSortingOrder } from '../../../../utils/getOrder'
import {
  ScalingDetailedTvlViewEntry,
  ScalingDetailedTvlViewSortingOrder,
} from '../types'

export function getScalingDetailedTvlViewSortingOrder(
  entries: ScalingDetailedTvlViewEntry[],
): ScalingDetailedTvlViewSortingOrder {
  return {
    name: getSortingOrder(entries, (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    ),
    total: getSortingOrder(entries, (a, b) => {
      const aTvl = parseFloat(a.tvl ?? '0')
      const bTvl = parseFloat(b.tvl ?? '0')
      return bTvl - aTvl
    }),
    external: getSortingOrder(entries, (a, b) => {
      const aExternal = parseFloat(a.ebv ?? '0')
      const bExternal = parseFloat(b.ebv ?? '0')
      return bExternal - aExternal
    }),
    canonical: getSortingOrder(entries, (a, b) => {
      const aCanonical = parseFloat(a.cbv ?? '0')
      const bCanonical = parseFloat(b.cbv ?? '0')
      return bCanonical - aCanonical
    }),
    native: getSortingOrder(entries, (a, b) => {
      const aNative = parseFloat(a.nmv ?? '0')
      const bNative = parseFloat(b.nmv ?? '0')
      return bNative - aNative
    }),
  }
}
