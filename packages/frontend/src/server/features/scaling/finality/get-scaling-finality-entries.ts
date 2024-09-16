import { type Layer2, layer2s } from '@l2beat/config'
import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { getFinality } from './get-finality'
import { type FinalityData, type FinalityProjectData } from './schema'
import {
  type ScalingFinalityEntry,
  type ScalingFinalityEntryData,
} from './types'
import { getFinalityConfigurations } from './utils/get-finality-configurations'

export async function getScalingFinalityEntries() {
  const configurations = getFinalityConfigurations()
  const [finality, tvl, icReport, projectVerification] = await Promise.all([
    getFinality(configurations),
    getProjectsLatestTvlUsd(),
    getImplementationChangeReport(),
    getProjectsVerificationStatuses(),
  ])

  const includedProjects = getIncludedProjects(layer2s, finality)

  const entries = includedProjects
    .map((project) => {
      const hasImplementationChanged =
        !!icReport.projects[project.id.toString()]
      const isVerified = !!projectVerification[project.id.toString()]

      return getScalingFinalityEntry(
        project,
        finality[project.id.toString()],
        isVerified,
        hasImplementationChanged,
      )
    })
    .filter(notUndefined)

  return orderByTvl(entries, tvl)
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
      syncedUntil: finalityProjectData.syncedUntil,
    },
  }

  return data
}

function isSynced(syncedUntil: number) {
  return UnixTime.now()
    .add(-1, 'days')
    .add(-1, 'hours')
    .lte(new UnixTime(syncedUntil))
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
  isVerified: boolean,
  hasImplementationChanged?: boolean,
): ScalingFinalityEntry {
  return {
    entryType: 'finality',
    ...getCommonScalingEntry({
      project,
      isVerified,
      hasImplementationChanged: hasImplementationChanged ?? false,
    }),
    dataAvailabilityMode: project.dataAvailability?.mode,
    data: getFinalityData(finalityProjectData, project),
    finalizationPeriod: project.display.finality?.finalizationPeriod,
  }
}
