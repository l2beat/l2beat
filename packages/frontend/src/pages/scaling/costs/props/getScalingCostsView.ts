import { Layer2 } from '@l2beat/config'
import {
  assert,
  L2CostsApiProject,
  L2CostsApiResponse,
  L2CostsDetails,
  notUndefined,
} from '@l2beat/shared-pure'

import { formatLargeNumber } from '../../../../utils'
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
    l2CostsApiResponse: costsApiResponse,
    implementationChange,
  } = pagesData

  const includedProjects = getIncludedProjects(projects, costsApiResponse)
  const orderedProjects = orderByTvl(includedProjects, tvlApiResponse)

  return {
    items: orderedProjects
      .map((project) => {
        const l2CostsProjectData =
          costsApiResponse.projects[project.id.toString()]
        assert(l2CostsProjectData, 'l2CostsProjectData is undefined')
        const hasImplementationChanged =
          !!implementationChange?.projects[project.id.toString()]

        return getScalingCostsViewEntry(
          project,
          l2CostsProjectData,
          hasImplementationChanged,
        )
      })
      .filter(notUndefined),
  }
}

function getScalingCostsViewEntry(
  project: Layer2,
  l2CostsProjectData: L2CostsApiProject,
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
    costs: getCostsData(l2CostsProjectData),
  }
}

function getCostsData(l2CostsProjectData: L2CostsApiProject): CostsData {
  const { last24h, last7d, last30d, last90d } = l2CostsProjectData
  if (!last24h || !last7d || !last30d || !last90d) {
    throw new Error(
      'One of the last24h, last7d, last30d or last90d is undefined',
    )
  }

  return {
    last24h: getDataDetails(last24h),
    last7d: getDataDetails(last7d),
    last30d: getDataDetails(last30d),
    last90d: getDataDetails(last90d),
  }
}

function getDataDetails(data: L2CostsDetails): CostsDataDetails {
  return {
    total: {
      ethCost: {
        displayValue: formatCurrency(data.total.ethCost, 'eth'),
        value: data.total.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(data.total.usdCost, 'usd'),
        value: data.total.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(data.total.gas),
        value: data.total.gas,
      },
    },
    blobs: data.blobs
      ? {
          ethCost: {
            displayValue: formatCurrency(data.blobs.ethCost, 'eth'),
            value: data.blobs.ethCost,
          },
          usdCost: {
            displayValue: formatCurrency(data.blobs.usdCost, 'usd'),
            value: data.blobs.usdCost,
          },
          gas: {
            displayValue: formatLargeNumber(data.blobs.gas),
            value: data.blobs.gas,
          },
        }
      : undefined,
    calldata: {
      ethCost: {
        displayValue: formatCurrency(data.calldata.ethCost, 'eth'),
        value: data.calldata.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(data.calldata.usdCost, 'usd'),
        value: data.calldata.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(data.calldata.gas),
        value: data.calldata.gas,
      },
    },
    compute: {
      ethCost: {
        displayValue: formatCurrency(data.compute.ethCost, 'eth'),
        value: data.compute.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(data.compute.usdCost, 'usd'),
        value: data.compute.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(data.compute.gas),
        value: data.compute.gas,
      },
    },
    overhead: {
      ethCost: {
        displayValue: formatCurrency(data.overhead.ethCost, 'eth'),
        value: data.overhead.ethCost,
      },
      usdCost: {
        displayValue: formatCurrency(data.overhead.usdCost, 'usd'),
        value: data.overhead.usdCost,
      },
      gas: {
        displayValue: formatLargeNumber(data.overhead.gas),
        value: data.overhead.gas,
      },
    },
  }
}

function getIncludedProjects(
  projects: Layer2[],
  costsApiResponse: L2CostsApiResponse,
) {
  return projects.filter(
    (p) => costsApiResponse.projects[p.id.toString()] !== undefined,
  )
}
