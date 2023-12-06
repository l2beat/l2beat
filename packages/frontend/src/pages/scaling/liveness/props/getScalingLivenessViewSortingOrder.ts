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
    stateUpdates: {
      '30D': orderByLiveness(
        projects,
        livenessApiResponse,
        'stateUpdates',
        'last30Days',
      ),
      '90D': orderByLiveness(
        projects,
        livenessApiResponse,
        'stateUpdates',
        'last90Days',
      ),
      MAX: orderByLiveness(
        projects,
        livenessApiResponse,
        'stateUpdates',
        'allTime',
      ),
    },
    proofSubmissions: {
      '30D': orderByLiveness(
        projects,
        livenessApiResponse,
        'proofSubmissions',
        'last30Days',
      ),
      '90D': orderByLiveness(
        projects,
        livenessApiResponse,
        'proofSubmissions',
        'last90Days',
      ),
      MAX: orderByLiveness(
        projects,
        livenessApiResponse,
        'proofSubmissions',
        'allTime',
      ),
    },
    txDataSubmissions: {
      '30D': orderByLiveness(
        projects,
        livenessApiResponse,
        'batchSubmissions',
        'last30Days',
      ),
      '90D': orderByLiveness(
        projects,
        livenessApiResponse,
        'batchSubmissions',
        'last90Days',
      ),
      MAX: orderByLiveness(
        projects,
        livenessApiResponse,
        'batchSubmissions',
        'allTime',
      ),
    },

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
  range: 'last30Days' | 'last90Days' | 'allTime',
) {
  return getProjectSortingOrder(projects, (a, b) => {
    const averageA =
      livenessApiResponse.projects[a.id.toString()]?.[type]?.[range]
        ?.averageInSeconds
    const averageB =
      livenessApiResponse.projects[b.id.toString()]?.[type]?.[range]
        ?.averageInSeconds

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
