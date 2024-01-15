import { Layer2, ScalingProjectDataAvailabilityMode } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'

import { ScalingFinalityViewEntry } from '../types'
import { ScalingFinalityViewProps } from '../view/ScalingFinalityView'

export function getScalingFinalityView(
  projects: Layer2[],
): ScalingFinalityViewProps {
  const includedProjects = projects.filter(
    (project) => !project.isArchived && !project.isUpcoming,
  )

  return {
    items: includedProjects.map(getScalingFinalityViewEntry),
  }
}

export function getScalingFinalityViewEntry(
  project: Layer2,
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
  }
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
