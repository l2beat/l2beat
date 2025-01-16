import {
  type DataAvailabilityMode,
  type Project,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { type WarningValueWithSentiment } from '@l2beat/shared-pure'
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
import { getFinalityNotSyncedStatus } from './utils/get-finality-not-synced-status'

export async function getFinalityProjects() {
  const projects = await ProjectService.STATIC.getProjects({
    select: ['statuses', 'scalingInfo', 'finalityInfo', 'finalityConfig'],
    optional: ['countdowns', 'scalingDa'],
    where: ['isScaling'],
    whereNot: ['isUpcoming', 'isArchived'],
  })

  return projects
}

export async function getScalingFinalityEntries() {
  const projects = await getFinalityProjects()

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
    isSynced: boolean
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
      notSyncedStatuses: [notSyncedStatus],
    }),
    category: project.scalingInfo.type,
    provider: project.scalingInfo.stack,
    dataAvailabilityMode: project.scalingDa?.mode,
    data: {
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
      isSynced: !notSyncedStatus,
    },
    finalizationPeriod: project.finalityInfo.finalizationPeriod,
    tvlOrder: tvl ?? -1,
  }
}
