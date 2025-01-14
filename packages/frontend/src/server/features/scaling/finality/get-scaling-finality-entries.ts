import {
  type DataAvailabilityMode,
  type Layer2,
  type ScalingProjectCategory,
  type ScalingProjectStack,
  layer2s,
} from '@l2beat/config'
import {
  UnixTime,
  type WarningValueWithSentiment,
  notUndefined,
} from '@l2beat/shared-pure'
import { type SyncStatus } from '~/types/sync-status'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry,
} from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { getFinality } from './get-finality'
import { type FinalityData, type FinalityProjectData } from './schema'
import { getFinalityConfigurations } from './utils/get-finality-configurations'

export async function getScalingFinalityEntries() {
  const configurations = getFinalityConfigurations()
  const [finality, tvl, projectsChangeReport] = await Promise.all([
    getFinality(configurations),
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const includedProjects = getIncludedProjects(layer2s, finality)

  const entries = includedProjects
    .map((project) =>
      getScalingFinalityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        finality[project.id.toString()],
        tvl[project.id],
      ),
    )
    .filter(notUndefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

function getFinalityData(
  finalityProjectData: FinalityProjectData | undefined,
  project: Layer2,
) {
  if (!finalityProjectData) {
    return
  }

  const data = {
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

export interface ScalingFinalityEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  provider: ScalingProjectStack | undefined
  dataAvailabilityMode: DataAvailabilityMode | undefined
  data: {
    timeToInclusion: {
      averageInSeconds: number
      minimumInSeconds: number | undefined
      maximumInSeconds: number
      warning: WarningValueWithSentiment | undefined
    }
    stateUpdateDelay:
      | {
          averageInSeconds: number
          warning: WarningValueWithSentiment | undefined
        }
      | undefined
    syncStatus: SyncStatus
  }
  finalizationPeriod: number | undefined
  tvlOrder: number
}

function getScalingFinalityEntry(
  project: Layer2,
  changes: ProjectChanges,
  finalityProjectData: FinalityProjectData | undefined,
  tvl: number | undefined,
): ScalingFinalityEntry | undefined {
  const data = getFinalityData(finalityProjectData, project)
  if (!data) {
    return
  }
  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncStatus: data?.syncStatus,
    }),
    category: project.display.category,
    provider: project.display.provider,
    dataAvailabilityMode: project.dataAvailability?.mode,
    data,
    finalizationPeriod: project.display.finality?.finalizationPeriod,
    tvlOrder: tvl ?? -1,
  }
}
