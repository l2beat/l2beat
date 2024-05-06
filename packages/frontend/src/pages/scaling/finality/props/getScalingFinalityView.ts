import { Layer2 } from '@l2beat/config'
import {
  FinalityApiResponse,
  FinalityProjectData,
  formatSeconds,
  notUndefined,
  UnixTime,
} from '@l2beat/shared-pure'

import { formatTimestamp } from '../../../../utils'
import { orderByTvl } from '../../../../utils/orderByTvl'
import {
  FinalityPagesData,
  ScalingFinalityViewEntry,
  ScalingFinalityViewEntryData,
} from '../types'
import { ScalingFinalityViewProps } from '../view/ScalingFinalityView'

export function getScalingFinalityView(
  projects: Layer2[],
  pagesData: FinalityPagesData,
): ScalingFinalityViewProps {
  const { finalityApiResponse, tvlApiResponse, implementationChange } =
    pagesData

  const includedProjects = getIncludedProjects(projects, finalityApiResponse)
  const orderedProjects = orderByTvl(includedProjects, tvlApiResponse)

  return {
    items: orderedProjects
      .map((project) => {
        const hasImplementationChanged =
          !!implementationChange?.projects[project.id.toString()]
        return getScalingFinalityViewEntry(
          project,
          finalityApiResponse.projects[project.id.toString()],
          hasImplementationChanged,
        )
      })
      .filter(notUndefined),
  }
}

function getScalingFinalityViewEntry(
  project: Layer2,
  finalityProjectData: FinalityProjectData | undefined,
  hasImplementationChanged?: boolean,
): ScalingFinalityViewEntry {
  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    category: project.display.category,
    dataAvailabilityMode: project.dataAvailability?.mode,
    provider: project.display.provider,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    hasImplementationChanged,
    purposes: project.display.purposes,
    stage: project.stage,
    data: getFinalityData(finalityProjectData, project),
    finalizationPeriod: project.display.finality?.finalizationPeriod
      ? formatSeconds(project.display.finality.finalizationPeriod, {
          fullUnit: true,
        })
      : 'None',
  }
}

function getFinalityData(
  finalityProjectData: FinalityProjectData | undefined,
  project: Layer2,
) {
  if (!finalityProjectData) return undefined
  const data: ScalingFinalityViewEntryData = {
    timeToInclusion: {
      averageInSeconds: finalityProjectData.timeToInclusion.averageInSeconds,
      minimumInSeconds: finalityProjectData.timeToInclusion.minimumInSeconds,
      maximumInSeconds: finalityProjectData.timeToInclusion.maximumInSeconds,
      warning: project.display.finality?.warnings?.timeToInclusion,
    },
    stateUpdateDelay: finalityProjectData.stateUpdateDelays
      ? {
          averageInSeconds:
            finalityProjectData.stateUpdateDelays.averageInSeconds,
          warning: project.display.finality?.warnings?.stateUpdateDelay,
        }
      : undefined,
    syncStatus: {
      isSynced: isSynced(finalityProjectData.syncedUntil),
      displaySyncedUntil: formatTimestamp(
        finalityProjectData.syncedUntil.toNumber(),
        {
          mode: 'datetime',
          longMonthName: true,
        },
      ),
    },
  }

  return data
}

function isSynced(syncedUntil: UnixTime) {
  return UnixTime.now().add(-1, 'days').add(-1, 'hours').lte(syncedUntil)
}

function getIncludedProjects(
  projects: Layer2[],
  finalityApiResponse: FinalityApiResponse,
) {
  return projects.filter(
    (p) =>
      !p.isUpcoming &&
      !p.isArchived &&
      (p.config.finality || finalityApiResponse.projects[p.id.toString()]) &&
      (p.display.category === 'ZK Rollup' ||
        p.display.category === 'Optimistic Rollup'),
  )
}
