import {
  type DataAvailabilityMode,
  type Project,
  ProjectService,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { TrackedTxsConfigSubtypeValues, UnixTime } from '@l2beat/shared-pure'
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
import { getLiveness } from './get-liveness'
import { type LivenessDetails, type LivenessProject } from './types'
import {
  type AnomalyIndicatorEntry,
  toAnomalyIndicatorEntries,
} from './utils/get-anomaly-entries'

export async function getScalingLivenessEntries() {
  const [tvl, projectsChangeReport, liveness, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    getLiveness(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo', 'livenessInfo'],
      optional: ['countdowns', 'scalingDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  const entries = projects
    .map((project) =>
      getScalingLivenessEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        liveness[project.id.toString()],
        tvl[project.id],
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export interface ScalingLivenessEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  provider: ScalingProjectStack | undefined
  data: LivenessData
  explanation: string | undefined
  anomalies: AnomalyIndicatorEntry[]
  dataAvailabilityMode: DataAvailabilityMode | undefined
  tvlOrder: number
}

function getScalingLivenessEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'livenessInfo',
    'countdowns' | 'scalingDa'
  >,
  changes: ProjectChanges,
  liveness: LivenessProject | undefined,
  tvl: number | undefined,
): ScalingLivenessEntry | undefined {
  if (!liveness) {
    return undefined
  }

  const data = getLivenessData(liveness, project)
  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncStatus: data?.syncStatus,
    }),
    category: project.scalingInfo.type,
    provider: project.scalingInfo.stack,
    data,
    explanation: project.livenessInfo?.explanation,
    anomalies: toAnomalyIndicatorEntries(liveness.anomalies ?? []),
    dataAvailabilityMode: project.scalingDa?.mode,
    tvlOrder: tvl ?? -1,
  }
}

export interface LivenessData {
  stateUpdates: LivenessTypeData | undefined
  batchSubmissions: LivenessTypeData | undefined
  proofSubmissions: LivenessTypeData | undefined
  syncStatus: SyncStatus
}

function getLivenessData(
  liveness: LivenessProject,
  project: Project<'livenessInfo'>,
) {
  let isSynced = true
  let lowestSyncedUntil = UnixTime.now()
  const syncTarget = UnixTime.now().add(-6, 'hours').toStartOf('hour')

  for (const subtype of TrackedTxsConfigSubtypeValues) {
    const data = liveness[subtype]
    if (!data) {
      continue
    }
    const syncedUntil = new UnixTime(data.syncedUntil)
    if (syncedUntil.lt(syncTarget)) {
      isSynced = false
      if (syncedUntil.lt(lowestSyncedUntil)) {
        lowestSyncedUntil = syncedUntil
      }
    }
  }

  return {
    stateUpdates: getSubTypeData(
      liveness.stateUpdates,
      project.livenessInfo.warnings?.stateUpdates,
      syncTarget,
    ),
    batchSubmissions: getSubTypeData(
      liveness.batchSubmissions,
      project.livenessInfo.warnings?.batchSubmissions,
      syncTarget,
    ),
    proofSubmissions: getSubTypeData(
      liveness.proofSubmissions,
      project.livenessInfo.warnings?.proofSubmissions,
      syncTarget,
    ),
    syncStatus: { isSynced, syncedUntil: lowestSyncedUntil.toNumber() },
  }
}

export interface LivenessTypeData {
  '30d': LivenessDatapoint | undefined
  '90d': LivenessDatapoint | undefined
  max: LivenessDatapoint | undefined
  syncStatus: SyncStatus
  warning: string | undefined
}

export interface LivenessDatapoint {
  averageInSeconds: number
  minimumInSeconds: number
  maximumInSeconds: number
}

function getSubTypeData(
  data: LivenessDetails | undefined,
  warning: string | undefined,
  syncTarget: UnixTime,
): LivenessTypeData | undefined {
  if (!data) return undefined
  const isSynced = data.syncedUntil >= syncTarget.toNumber()
  return {
    '30d': data['30d'],
    '90d': data['90d'],
    max: data.max,
    syncStatus: { isSynced, syncedUntil: data.syncedUntil },
    warning,
  }
}
