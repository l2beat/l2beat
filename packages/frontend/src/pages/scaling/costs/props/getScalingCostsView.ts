import { Layer2 } from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
  L2CostsDetails,
} from '../../../../build/api/DELETE_THIS_FILE'
import { formatLargeNumber } from '../../../../utils'
import { formatCurrency } from '../../../../utils/format'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { CostsData, CostsPagesData, ScalingCostsViewEntry } from '../types'
import { ScalingCostsViewProps } from '../view/ScalingCostsView'

export function getScalingCostsView(
  projects: Layer2[],
  pagesData: CostsPagesData,
): ScalingCostsViewProps {
  const { tvlApiResponse, costsApiResponse } = pagesData

  const includedProjects = getIncludedProjects(projects, costsApiResponse)
  const orderedProjects = orderByTvl(includedProjects, tvlApiResponse)

  return {
    items: orderedProjects
      .map((project) => {
        const l2CostsProjectData =
          costsApiResponse.projects[project.id.toString()]
        assert(l2CostsProjectData, 'l2CostsProjectData is undefined')

        return getScalingCostsViewEntry(project, l2CostsProjectData)
      })
      .filter(notUndefined),
  }
}

function getScalingCostsViewEntry(
  project: Layer2,
  l2CostsProjectData: L2CostsApiProject,
): ScalingCostsViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    dataAvailabilityMode: project.dataAvailability?.mode,
    provider: project.display.provider,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: project.stage,
    costs: getCostsData(l2CostsProjectData),
  }
}

function getCostsData(l2CostsProjectData: L2CostsApiProject): CostsData {
  return {
    last24h: getDataDetails(l2CostsProjectData.last24h),
    last7d: getDataDetails(l2CostsProjectData.last7d),
    last30d: getDataDetails(l2CostsProjectData.last30d),
    last90d: getDataDetails(l2CostsProjectData.last90d),
  }
}

function getDataDetails(data: L2CostsDetails) {
  return {
    total: getDataDetailsValues(data.total),
    blobs: getDataDetailsValues(data.blobs),
    calldata: getDataDetailsValues(data.calldata),
    compute: getDataDetailsValues(data.compute),
    overhead: getDataDetailsValues(data.overhead),
  }
}

function getDataDetailsValues(data: L2CostsDetails[keyof L2CostsDetails]) {
  return {
    ethCost: {
      displayValue: formatCurrency(data.ethCost, 'eth'),
      value: data.ethCost,
    },
    usdCost: {
      displayValue: formatCurrency(data.usdCost, 'usd'),
      value: data.usdCost,
    },
    gas: {
      displayValue: formatLargeNumber(data.gas),
      value: data.gas,
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
