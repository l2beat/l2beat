import { Layer2 } from '@l2beat/config'
import {
  ActivityApiCharts,
  assert,
  L2CostsApiProject,
  L2CostsApiResponse,
  notUndefined,
} from '@l2beat/shared-pure'

import { formatLargeNumber } from '../../../../utils'
import { getTransactionCount } from '../../../../utils/activity/getTransactionCount'
import { formatCurrency } from '../../../../utils/format'
import { orderByTvl } from '../../../../utils/orderByTvl'
import {
  CostsData,
  CostsDataDetails,
  CostsPagesData,
  ScalingCostsViewEntry,
} from '../types'
import { ScalingCostsViewProps } from '../view/ScalingCostsView'

export function getScalingCostsView(
  projects: Layer2[],
  pagesData: CostsPagesData,
): ScalingCostsViewProps {
  const {
    tvlApiResponse,
    l2CostsApiResponse,
    implementationChange,
    activityApiResponse,
  } = pagesData

  const includedProjects = getIncludedProjects(projects, l2CostsApiResponse)
  const orderedProjects = orderByTvl(includedProjects, tvlApiResponse)

  return {
    items: orderedProjects
      .map((project) => {
        const l2CostsProjectData =
          l2CostsApiResponse.projects[project.id.toString()]
        assert(l2CostsProjectData, 'l2CostsProjectData is undefined')
        const activityApiProjectData =
          activityApiResponse?.projects[project.id.toString()]

        const hasImplementationChanged =
          !!implementationChange?.projects[project.id.toString()]

        return getScalingCostsViewEntry(
          project,
          l2CostsProjectData,
          activityApiProjectData,
          hasImplementationChanged,
        )
      })
      .filter(notUndefined),
  }
}

function getScalingCostsViewEntry(
  project: Layer2,
  l2CostsProjectData: L2CostsApiProject,
  activityApiProjectData: ActivityApiCharts | undefined,
  hasImplementationChanged: boolean,
): ScalingCostsViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    showProjectUnderReview: !!project.isUnderReview,
    hasImplementationChanged,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    category: project.display.category,
    provider: project.display.provider,
    purposes: project.display.purposes,
    stage: project.stage,
    costs: getCostsData(l2CostsProjectData, activityApiProjectData),
  }
}

function getCostsData(
  l2CostsProjectData: L2CostsApiProject,
  activityApiProjectData: ActivityApiCharts | undefined,
): CostsData {
  const { last24h, last7d, last30d, last90d } = l2CostsProjectData
  if (!last24h || !last7d || !last30d || !last90d) {
    throw new Error(
      'One of the last24h, last7d, last30d or last90d is undefined',
    )
  }

  return {
    last24h: getDataDetails(
      'last24h',
      l2CostsProjectData,
      activityApiProjectData,
    ),
    last7d: getDataDetails(
      'last7d',
      l2CostsProjectData,
      activityApiProjectData,
    ),
    last30d: getDataDetails(
      'last30d',
      l2CostsProjectData,
      activityApiProjectData,
    ),
    last90d: getDataDetails(
      'last90d',
      l2CostsProjectData,
      activityApiProjectData,
    ),
  }
}

function getDataDetails(
  type: keyof Omit<L2CostsApiProject, 'syncedUntil'>,
  data: L2CostsApiProject,
  activityApiProjectData: ActivityApiCharts | undefined,
): CostsDataDetails {
  const dataRange = data[type]
  assert(dataRange, `${type} is undefined`)

  const txCount = activityApiProjectData?.daily.data
    ? getTransactionCount(
        activityApiProjectData?.daily.data,
        'project',
        typeToPeriod[type],
      )
    : undefined

  return {
    total: {
      ethCost: {
        displayValue: formatCurrency(dataRange?.total.ethCost, 'eth'),
        value: dataRange?.total.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(dataRange?.total.usdCost, 'usd'),
        value: dataRange?.total.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(dataRange?.total.gas),
        value: dataRange?.total.gas,
      },
    },
    blobs: dataRange?.blobs
      ? {
          ethCost: {
            displayValue: formatCurrency(dataRange?.blobs.ethCost, 'eth'),
            value: dataRange?.blobs.ethCost,
          },
          usdCost: {
            displayValue: formatCurrency(dataRange?.blobs.usdCost, 'usd'),
            value: dataRange?.blobs.usdCost,
          },
          gas: {
            displayValue: formatLargeNumber(dataRange?.blobs.gas),
            value: dataRange?.blobs.gas,
          },
        }
      : undefined,
    calldata: {
      ethCost: {
        displayValue: formatCurrency(dataRange.calldata.ethCost, 'eth'),
        value: dataRange.calldata.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(dataRange.calldata.usdCost, 'usd'),
        value: dataRange.calldata.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(dataRange.calldata.gas),
        value: dataRange.calldata.gas,
      },
    },
    compute: {
      ethCost: {
        displayValue: formatCurrency(dataRange.compute.ethCost, 'eth'),
        value: dataRange.compute.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(dataRange.compute.usdCost, 'usd'),
        value: dataRange.compute.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(dataRange.compute.gas),
        value: dataRange.compute.gas,
      },
    },
    overhead: {
      ethCost: {
        displayValue: formatCurrency(dataRange.overhead.ethCost, 'eth'),
        value: dataRange.overhead.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(dataRange.overhead.usdCost, 'usd'),
        value: dataRange.overhead.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(dataRange.overhead.gas),
        value: dataRange.overhead.gas,
      },
    },
    txCount: txCount
      ? {
          value: txCount,
          displayValue: formatLargeNumber(txCount),
        }
      : undefined,
  }
}

const typeToPeriod = {
  last24h: 'day',
  last7d: 'week',
  last30d: 'month',
  last90d: 'three months',
} as const

function getIncludedProjects(
  projects: Layer2[],
  costsApiResponse: L2CostsApiResponse,
) {
  return projects.filter(
    (p) =>
      costsApiResponse.projects[p.id.toString()] !== undefined &&
      !p.isArchived &&
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}
