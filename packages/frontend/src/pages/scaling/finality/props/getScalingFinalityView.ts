import { Layer2, ScalingProjectDataAvailabilityMode } from '@l2beat/config'
import { assertUnreachable,FinalityApiResponse, FinalityDataPoint } from '@l2beat/shared-pure'

import { FinalityPagesData, ScalingFinalityViewEntry } from '../types'
import { ScalingFinalityViewProps } from '../view/ScalingFinalityView'

export function getScalingFinalityView(
  projects: Layer2[],
  pagesData: FinalityPagesData,
): ScalingFinalityViewProps {
  const { finalityApiResponse } = pagesData

  const includedProjects = getIncludedProjects(projects, finalityApiResponse)

  return {
    items: includedProjects.map((project) =>
      getScalingFinalityViewEntry(
        project,
        finalityApiResponse.projects[project.id.toString()],
      ),
    ),
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

function getIncludedProjects(
  projects: Layer2[],
  finalityResponse: FinalityApiResponse,
) {
  return projects.filter(
    (p) =>
      finalityResponse.projects[p.id.toString()] &&
      !p.isUpcoming &&
      !p.isArchived,
  )
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
