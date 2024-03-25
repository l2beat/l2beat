import { Layer2 } from '@l2beat/config'
import { assert, notUndefined } from '@l2beat/shared-pure'

import {
  L2CostsApiProject,
  L2CostsApiResponse,
} from '../../../../build/api/DELETE_THIS_FILE'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { L2CostsPagesData, ScalingL2CostsViewEntry } from '../types'
import { ScalingL2CostsViewProps } from '../view/ScalingL2CostsView'

export function getScalingL2CostsView(
  projects: Layer2[],
  pagesData: L2CostsPagesData,
): ScalingL2CostsViewProps {
  const { tvlApiResponse, l2CostsApiResponse } = pagesData

  const includedProjects = getIncludedProjects(projects, l2CostsApiResponse)
  const orderedProjects = orderByTvl(includedProjects, tvlApiResponse)

  return {
    items: orderedProjects
      .map((project) => {
        const l2CostsProjectData =
          l2CostsApiResponse.projects[project.id.toString()]
        assert(l2CostsProjectData, 'l2CostsProjectData is undefined')

        return getScalingL2CostsViewEntry(project, l2CostsProjectData)
      })
      .filter(notUndefined),
  }
}

function getScalingL2CostsViewEntry(
  project: Layer2,
  l2CostsProjectData: L2CostsApiProject,
): ScalingL2CostsViewEntry {
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
    data: l2CostsProjectData,
  }
}

function getIncludedProjects(
  projects: Layer2[],
  l2CostsApiResponse: L2CostsApiResponse,
) {
  return projects.filter(
    (p) => l2CostsApiResponse.projects[p.id.toString()] !== undefined,
  )
}
