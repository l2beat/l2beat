import { Layer2 } from '@l2beat/config'
import { LivenessApiProject, LivenessApiResponse } from '@l2beat/shared-pure'

import { getProjectSortingOrder } from '../../../../utils/getOrder'
import { ScalingLivenessViewSortingOrder } from '../types'

export function getScalingLivenessViewSortingOrder(
  projects: Layer2[],
  livenessApiResponse: LivenessApiResponse,
): ScalingLivenessViewSortingOrder {
  return {
    name: getProjectSortingOrder(projects, (a, b) =>
      a.display.name.toLowerCase().localeCompare(b.display.name.toLowerCase()),
    ),
    stateUpdates: orderByLiveness(
      projects,
      livenessApiResponse,
      'stateUpdates',
    ),
    proofSubmissions: orderByLiveness(
      projects,
      livenessApiResponse,
      'proofSubmissions',
    ),
    txDataSubmissions: orderByLiveness(
      projects,
      livenessApiResponse,
      'batchSubmissions',
    ),
    technology: getProjectSortingOrder(projects, (a, b) =>
      a.display.category
        .toLowerCase()
        .localeCompare(b.display.category.toLowerCase()),
    ),
  }
}

function orderByLiveness(
  projects: Layer2[],
  livenessApiResponse: LivenessApiResponse,
  type: Exclude<keyof LivenessApiProject, 'anomalies'>,
) {
  return getProjectSortingOrder(projects, (a, b) => {
    const averageA =
      livenessApiResponse.projects[a.id.toString()]?.[type]?.last30Days
    const averageB =
      livenessApiResponse.projects[b.id.toString()]?.[type]?.last30Days

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
