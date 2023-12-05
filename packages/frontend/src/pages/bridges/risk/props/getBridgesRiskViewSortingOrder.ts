import { getEntrySortingOrder } from '../../../../utils/getOrder'
import { BridgesRiskViewEntry, BridgesRiskViewSortingOrder } from '../types'

export function getBridgesRiskViewSortingOrder(
  items: BridgesRiskViewEntry[],
): BridgesRiskViewSortingOrder {
  return {
    name: getEntrySortingOrder(items, (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    ),
    validatedBy: getEntrySortingOrder(items, (a, b) => {
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
    type: getEntrySortingOrder(items, (a, b) =>
      a.category.toLowerCase().localeCompare(b.category.toLowerCase()),
    ),
  }
}
