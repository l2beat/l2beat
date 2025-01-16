import {
  type DataAvailabilityMode,
  type Project,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { UnixTime, type WarningValueWithSentiment } from '@l2beat/shared-pure'
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
import { type FinalityProjectData } from './schema'

export async function getScalingFinalityEntries() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo', 'finalityInfo', 'finalityConfig'],
    optional: ['countdowns', 'scalingDa'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  const [finality, tvl, projectsChangeReport] = await Promise.all([
    getFinality(projects),
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
  ])

  const entries = projects
    .map((project) =>
      getScalingFinalityEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        finality[project.id.toString()],
        tvl[project.id],
      ),
    )
    .filter((x) => x !== undefined)
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
    syncStatus: SyncStatus
  }
  finalizationPeriod: number | undefined
  tvlOrder: number
}

function getScalingFinalityEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'finalityInfo',
    'countdowns' | 'scalingDa'
  >,
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
    category: project.scalingInfo.type,
    provider: project.scalingInfo.stack,
    dataAvailabilityMode: project.scalingDa?.mode,
    data,
    finalizationPeriod: project.finalityInfo.finalizationPeriod,
    tvlOrder: tvl ?? -1,
  }
}

function getFinalityData(
  finalityProjectData: FinalityProjectData | undefined,
  project: Project<'finalityInfo'>,
) {
  if (!finalityProjectData) {
    return
  }

  const data = {
    timeToInclusion: {
      averageInSeconds: finalityProjectData.timeToInclusion.averageInSeconds,
      minimumInSeconds: finalityProjectData.timeToInclusion.minimumInSeconds,
      maximumInSeconds: finalityProjectData.timeToInclusion.maximumInSeconds,
      warning: project.finalityInfo?.warnings?.timeToInclusion,
    },
    stateUpdateDelay: finalityProjectData.stateUpdateDelays
      ? {
          averageInSeconds:
            finalityProjectData.stateUpdateDelays.averageInSeconds,
          warning: project.finalityInfo?.warnings?.stateUpdateDelay,
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
