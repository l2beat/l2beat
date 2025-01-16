import {
  type DataAvailabilityMode,
  type Layer2,
  type ScalingProjectCategory,
  type ScalingProjectStack,
  layer2s,
} from '@l2beat/config'
import {
  type WarningValueWithSentiment,
  notUndefined,
} from '@l2beat/shared-pure'
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
import { getFinalityNotSyncedStatus } from './utils/get-finality-not-synced-status'

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
    isSynced: boolean
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
  if (!finalityProjectData) {
    return
  }

  const notSyncedStatus = getFinalityNotSyncedStatus(
    finalityProjectData.syncedUntil,
  )

  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncStatuses: [notSyncedStatus],
    }),
    category: project.display.category,
    provider: project.display.provider,
    dataAvailabilityMode: project.dataAvailability?.mode,
    data: {
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
      isSynced: !notSyncedStatus,
    },
    finalizationPeriod: project.display.finality?.finalizationPeriod,
    tvlOrder: tvl ?? -1,
  }
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
