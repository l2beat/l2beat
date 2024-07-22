import { type Layer2 } from '@l2beat/config'
import {
  type FinalityApiResponse,
  type FinalityProjectData,
  type ProjectId,
  UnixTime,
  formatSeconds,
  notUndefined,
} from '@l2beat/shared-pure'
import { formatTimestamp } from '~/utils/dates'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { orderByTvl } from '../../tvl/order-by-tvl'
import {
  type ScalingFinalityEntry,
  type ScalingFinalityEntryData,
} from './types'

export async function getScalingFinalityEntries(
  projects: Layer2[],
  tvl: Record<ProjectId, number>,
  finality: FinalityApiResponse,
) {
  const includedProjects = getIncludedProjects(projects, finality)
  const orderedProjects = orderByTvl(includedProjects, tvl)

  const implementationChangeReport = await getImplementationChangeReport()

  return {
    items: orderedProjects
      .map((project) => {
        const hasImplementationChanged =
          !!implementationChangeReport?.projects[project.id.toString()]
        return getScalingFinalityEntry(
          project,
          finality.projects[project.id.toString()],
          hasImplementationChanged,
        )
      })
      .filter(notUndefined),
  }
}

function getFinalityData(
  finalityProjectData: FinalityProjectData | undefined,
  project: Layer2,
) {
  if (!finalityProjectData) return undefined
  const data: ScalingFinalityEntryData = {
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
      (p.config.finality ?? finalityApiResponse.projects[p.id.toString()]) &&
      (p.display.category === 'ZK Rollup' ||
        p.display.category === 'Optimistic Rollup'),
  )
}
function getScalingFinalityEntry(
  project: Layer2,
  finalityProjectData: FinalityProjectData | undefined,
  hasImplementationChanged?: boolean,
): ScalingFinalityEntry {
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
          fullUnit: false,
        })
      : 'None',
  }
}
