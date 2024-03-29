import { Layer2 } from '@l2beat/config'
import {
  ActivityApiCharts,
  assert,
  L2CostsApiProject,
  L2CostsApiResponse,
  L2CostsBreakdown,
  notUndefined,
} from '@l2beat/shared-pure'

import { formatLargeNumber } from '../../../../utils'
import { getTransactionCount } from '../../../../utils/activity/getTransactionCount'
import { formatCurrency } from '../../../../utils/format'
import { orderByTvl } from '../../../../utils/orderByTvl'
import {
  CostsData,
  CostsDataBreakdown,
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

  const period = typeToPeriod[type]
  const txCount = activityApiProjectData?.daily.data
    ? getTransactionCount(activityApiProjectData?.daily.data, 'project', period)
    : undefined

  return {
    total: getCostsDataBreakdown(dataRange.total, txCount),
    blobs: dataRange?.blobs
      ? getCostsDataBreakdown(dataRange.blobs, txCount)
      : undefined,
    calldata: getCostsDataBreakdown(dataRange.calldata, txCount),
    compute: getCostsDataBreakdown(dataRange.compute, txCount),
    overhead: getCostsDataBreakdown(dataRange.overhead, txCount),
    txCount: txCount
      ? {
          value: txCount,
          displayValue: formatLargeNumber(txCount),
        }
      : undefined,
  }
}

function getCostsDataBreakdown(
  data: L2CostsBreakdown,
  txCount: number | undefined,
): CostsDataBreakdown {
  return {
    ethCost: {
      displayValue: formatCurrency(data.ethCost, 'eth'),
      value: data.ethCost,
      amortized: txCount
        ? {
            value: data.ethCost / txCount,
            displayValue: formatCurrency(data.ethCost / txCount, 'eth', 6),
          }
        : undefined,
    },
    usdCost: {
      displayValue: formatCurrency(data.usdCost, 'usd'),
      value: data.usdCost,
      amortized: txCount
        ? {
            value: data.usdCost / txCount,
            displayValue: formatCurrency(data.usdCost / txCount, 'usd', 4),
          }
        : undefined,
    },
    gas: {
      displayValue: formatLargeNumber(data.gas),
      value: data.gas,
      amortized: txCount
        ? {
            value: data.gas / txCount,
            displayValue: formatLargeNumber(data.gas / txCount),
          }
        : undefined,
    },
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
