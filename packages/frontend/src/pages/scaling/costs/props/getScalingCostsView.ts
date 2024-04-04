import { Layer2 } from '@l2beat/config'
import {
  ActivityApiCharts,
  L2CostsApiResponse,
  L2CostsProjectApiCharts,
  notUndefined,
} from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { CostsPagesData, ScalingCostsViewEntry } from '../types'
import { ScalingCostsViewProps } from '../view/ScalingCostsView'
import { getCostsData } from './getCostsData'

const UPCOMING_PROJECTS = ['paradex']

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
  l2CostsChart: L2CostsProjectApiCharts | undefined,
  activityChart: ActivityApiCharts | undefined,
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
    data: l2CostsChart ? getCostsData(l2CostsChart, activityChart) : undefined,
  }
}

function getIncludedProjects(
  projects: Layer2[],
  costsApiResponse: L2CostsApiResponse,
) {
  return projects.filter(
    (p) =>
      (costsApiResponse.projects[p.id.toString()] !== undefined ||
        UPCOMING_PROJECTS.includes(p.id.toString())) &&
      !p.isArchived &&
      !p.isUpcoming &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup'),
  )
}
