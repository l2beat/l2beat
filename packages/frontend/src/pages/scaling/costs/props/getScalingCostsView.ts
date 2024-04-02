import { Layer2 } from '@l2beat/config'
import {
  ActivityApiChart,
  assert,
  L2CostsApiChart,
  L2CostsApiResponse,
  notUndefined,
} from '@l2beat/shared-pure'

import { formatLargeNumber } from '../../../../utils'
import { getTransactionCount } from '../../../../utils/activity/getTransactionCount'
import { getCostsSum } from '../../../../utils/costs/getCostsSum'
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
          l2CostsProjectData.daily,
          activityApiProjectData?.daily,
          hasImplementationChanged,
        )
      })
      .filter(notUndefined),
  }
}

function getScalingCostsViewEntry(
  project: Layer2,
  l2CostsChart: L2CostsApiChart,
  activityChart: ActivityApiChart | undefined,
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
    costs: getCostsData(l2CostsChart, activityChart),
  }
}

function getCostsData(
  l2CostsChart: L2CostsApiChart,
  activityApiChart: ActivityApiChart | undefined,
): CostsData {
  return {
    last24h: getDataDetails(l2CostsChart, activityApiChart, 1),
    last7d: getDataDetails(l2CostsChart, activityApiChart, 7),
    last30d: getDataDetails(l2CostsChart, activityApiChart, 30),
    last90d: getDataDetails(l2CostsChart, activityApiChart, 90),
  }
}

function getDataDetails(
  costsChart: L2CostsApiChart,
  activityChart: ActivityApiChart | undefined,
  days: number,
): CostsDataDetails {
  const txCount = activityChart
    ? getTransactionCount(activityChart?.data, 'project', days)
    : undefined

  const totalData = {
    ethCost: getCostsSum(costsChart.data, 'totalEth', days),
    usdCost: getCostsSum(costsChart.data, 'totalUsd', days),
    gas: getCostsSum(costsChart.data, 'totalGas', days),
  }
  const blobsData = {
    ethCost: getCostsSum(costsChart.data, 'blobsEth', days),
    usdCost: getCostsSum(costsChart.data, 'blobsUsd', days),
    gas: getCostsSum(costsChart.data, 'blobsGas', days),
  }

  const calldataData = {
    ethCost: getCostsSum(costsChart.data, 'calldataEth', days),
    usdCost: getCostsSum(costsChart.data, 'calldataUsd', days),
    gas: getCostsSum(costsChart.data, 'calldataGas', days),
  }

  const computeData = {
    ethCost: getCostsSum(costsChart.data, 'computeEth', days),
    usdCost: getCostsSum(costsChart.data, 'computeUsd', days),
    gas: getCostsSum(costsChart.data, 'computeGas', days),
  }

  const overheadData = {
    ethCost: getCostsSum(costsChart.data, 'overheadEth', days),
    usdCost: getCostsSum(costsChart.data, 'overheadUsd', days),
    gas: getCostsSum(costsChart.data, 'overheadGas', days),
  }

  return {
    total: getCostsDataBreakdown(totalData, txCount),
    blobs: getCostsDataBreakdown(blobsData, txCount),
    calldata: getCostsDataBreakdown(calldataData, txCount),
    compute: getCostsDataBreakdown(computeData, txCount),
    overhead: getCostsDataBreakdown(overheadData, txCount),
    txCount: txCount
      ? {
          value: txCount,
          displayValue: formatLargeNumber(txCount),
        }
      : undefined,
  }
}

function getCostsDataBreakdown(
  data: {
    ethCost: number
    usdCost: number
    gas: number
  },
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
            displayValue: formatCurrency(data.usdCost / txCount, 'usd'),
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
