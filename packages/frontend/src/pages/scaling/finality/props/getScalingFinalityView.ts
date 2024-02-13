import { Layer2, ScalingProjectDataAvailabilityMode } from '@l2beat/config'
import {
  assertUnreachable,
  FinalityDataPoint,
  formatSeconds,
  notUndefined,
} from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import { FinalityPagesData, ScalingFinalityViewEntry } from '../types'
import { ScalingFinalityViewProps } from '../view/ScalingFinalityView'

export function getScalingFinalityView(
  projects: Layer2[],
  pagesData: FinalityPagesData,
): ScalingFinalityViewProps {
  const { finalityApiResponse, tvlApiResponse } = pagesData

  const includedProjects = getIncludedProjects(projects)
  const orderedProjects = orderByTvl(includedProjects, tvlApiResponse)
  return {
    items: orderedProjects
      .map((project) => {
        const finalityProjectData =
          finalityApiResponse.projects[project.id.toString()]
        if (!finalityProjectData?.timeToInclusion) {
          return
        }
        return getScalingFinalityViewEntry(
          project,
          finalityProjectData.timeToInclusion,
        )
      })
      .filter(notUndefined),
  }
}

export function getScalingFinalityViewEntry(
  project: Layer2,
  timeToInclusion: FinalityDataPoint,
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
    timeToInclusion: {
      ...timeToInclusion,
      warning: project.display.finality?.warning,
    },
    finalizationPeriod: project.display.finality?.finalizationPeriod
      ? formatSeconds(project.display.finality.finalizationPeriod, {
          fullUnit: true,
        })
      : undefined,
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
