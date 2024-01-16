import { Layer2, ScalingProjectDataAvailabilityMode } from '@l2beat/config'
import {
  assertUnreachable,
  FinalityDataPoint,
  notUndefined,
} from '@l2beat/shared-pure'

import { FinalityPagesData, ScalingFinalityViewEntry } from '../types'
import { ScalingFinalityViewProps } from '../view/ScalingFinalityView'

export function getScalingFinalityView(
  projects: Layer2[],
  pagesData: FinalityPagesData,
): ScalingFinalityViewProps {
  const { finalityApiResponse } = pagesData

  const includedProjects = getIncludedProjects(projects)

  return {
    items: includedProjects
      .map((project) => {
        const finalityDataPoint =
          finalityApiResponse.projects[project.id.toString()]
        if (!finalityDataPoint) {
          return
        }
        return getScalingFinalityViewEntry(project, finalityDataPoint)
      })
      .filter(notUndefined),
  }
}

export function getScalingFinalityViewEntry(
  project: Layer2,
  finalityDataPoint: FinalityDataPoint,
): ScalingFinalityViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    dataAvailabilityMode: daModeToDisplay(project.display.dataAvailabilityMode),
    provider: project.display.provider,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    purposes: project.display.purposes,
    stage: project.stage,
    timeToFinalize: {
      ...finalityDataPoint,
      warning: project.display.finalityWarning,
    },
  }
}

function getIncludedProjects(projects: Layer2[]) {
  return projects.filter((p) => !p.isUpcoming && !p.isArchived)
}

function daModeToDisplay(daMode: ScalingProjectDataAvailabilityMode) {
  switch (daMode) {
    case 'StateDiffs':
      return 'State diffs'
    case 'TxData':
      return 'Transaction data'
    case 'NotApplicable':
      return undefined
    default:
      assertUnreachable(daMode)
  }
}
