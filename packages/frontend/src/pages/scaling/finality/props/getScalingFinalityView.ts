import { Layer2, ScalingProjectDataAvailabilityMode } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

import { ScalingFinalityViewEntry } from '../types'
import { ScalingFinalityViewProps } from '../view/ScalingFinalityView'

export function getScalingFinalityView(
  projects: Layer2[],
  finalityResponse: any,
): ScalingFinalityViewProps {
  const includedProjects = getIncludedProjects(projects, finalityResponse)
  //Add filter by exluding projects that are not in the finalityApiResponse

  return {
    items: includedProjects.map((project) =>
      getScalingFinalityViewEntry(
        project,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        finalityResponse.projects[project.id.toString()],
      ),
    ),
  }
}

export function getScalingFinalityViewEntry(
  project: Layer2,
  projectApiResponse: any,
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    timeToFinalize: projectApiResponse,
  }
}

function getIncludedProjects(
  projects: Layer2[],
  finalityResponse: any | undefined,
) {
  return projects.filter(
    (p) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      finalityResponse?.projects[p.id.toString()] &&
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
