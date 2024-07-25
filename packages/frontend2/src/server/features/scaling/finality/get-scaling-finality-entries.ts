import { type Layer2 } from '@l2beat/config'
import { type ProjectId, UnixTime, notUndefined } from '@l2beat/shared-pure'
import { type ImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { orderByTvl } from '../../tvl/order-by-tvl'
import { type FinalityData, type FinalityProjectData } from './schema'
import {
  type ScalingFinalityEntry,
  type ScalingFinalityEntryData,
} from './types'

export async function getScalingFinalityEntries(
  projects: Layer2[],
  tvl: Record<ProjectId, number>,
  finality: FinalityData,
  implementationChangeReport: ImplementationChangeReport,
) {
  const includedProjects = getIncludedProjects(projects, finality)
  const orderedProjects = orderByTvl(includedProjects, tvl)

  return orderedProjects
    .map((project) => {
      const hasImplementationChanged =
        !!implementationChangeReport?.projects[project.id.toString()]

      return getScalingFinalityEntry(
        project,
        finality[project.id.toString()],
        hasImplementationChanged,
      )
    })
    .filter(notUndefined)
}

function getFinalityData(
  finalityProjectData: FinalityProjectData | undefined,
  project: Layer2,
) {
  if (!finalityProjectData) {
    return
  }

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
      syncedUntil: finalityProjectData.syncedUntil.toNumber(),
    },
  }

  return data
}

function isSynced(syncedUntil: UnixTime) {
  return UnixTime.now().add(-1, 'days').add(-1, 'hours').lte(syncedUntil)
}

function getIncludedProjects(projects: Layer2[], finality: FinalityData) {
  return projects.filter(
    (p) =>
      !p.isUpcoming &&
      !p.isArchived &&
      (p.config.finality ?? finality[p.id.toString()]) &&
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
    type: project.type,
    name: project.display.name,
    href: `/scaling/projects/${project.display.slug}`,
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
    finalizationPeriod: project.display.finality?.finalizationPeriod,
  }
}
