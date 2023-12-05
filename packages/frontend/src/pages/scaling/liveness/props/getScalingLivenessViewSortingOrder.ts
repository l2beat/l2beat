import { getSortingOrder } from '../../../../utils/getOrder'
import {
  ScalingLivenessViewEntry,
  ScalingLivenessViewSortingOrder,
} from '../types'

export function getScalingLivenessViewSortingOrder(
  entries: ScalingLivenessViewEntry[],
): ScalingLivenessViewSortingOrder {
  return {
    name: getSortingOrder(entries, (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    ),
    stateUpdates: orderByLiveness(entries, 'stateUpdates'),
    txDataSubmissions: orderByLiveness(entries, 'batchSubmissions'),
    technology: getSortingOrder(entries, (a, b) =>
      a.category.toLowerCase().localeCompare(b.category.toLowerCase()),
    ),
  }
}

function orderByLiveness(
  projects: ScalingLivenessViewEntry[],
  type: 'stateUpdates' | 'batchSubmissions',
) {
  return getSortingOrder(projects, (a, b) => {
    const averageA = a[type]?.last30Days?.averageInSeconds
    const averageB = b[type]?.last30Days?.averageInSeconds

    if (averageA === undefined && averageB === undefined) {
      return 0
    }
    if (averageA === undefined) {
      return 1
    }
    if (averageB === undefined) {
      return -1
    }
    return averageA > averageB ? -1 : 1
  })
}
