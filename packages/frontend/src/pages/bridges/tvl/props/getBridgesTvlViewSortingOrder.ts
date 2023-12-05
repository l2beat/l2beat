import { getSortingOrder } from '../../../../components/table/props/getSortingOrder'
import { BridgesTvlViewEntry, BridgesTvlViewSortingOrder } from '../view/types'

export function getBridgesTvlViewSortingOrder(
  entries: BridgesTvlViewEntry[],
): BridgesTvlViewSortingOrder {
  return {
    name: getSortingOrder(entries, (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    ),
    tvl: getSortingOrder(entries, (a, b) => {
      const aTvl = parseFloat(a.tvl ?? '0')
      const bTvl = parseFloat(b.tvl ?? '0')
      return bTvl - aTvl
    }),
    sevenDayChange: getSortingOrder(entries, (a, b) => {
      const aChange = parseFloat(a.sevenDayChange ?? '0')
      const bChange = parseFloat(b.sevenDayChange ?? '0')
      return bChange - aChange
    }),
    validatedBy: getSortingOrder(entries, (a, b) => {
      if (b.validatedBy?.value === undefined) {
        return 1
      }

      if (a.validatedBy?.value === undefined) {
        return -1
      }

      return a.validatedBy.value
        .toLowerCase()
        .localeCompare(b.validatedBy.value.toLowerCase())
    }),
    type: getSortingOrder(entries, (a, b) =>
      a.category.toLowerCase().localeCompare(b.category.toLowerCase()),
    ),
  }
}
