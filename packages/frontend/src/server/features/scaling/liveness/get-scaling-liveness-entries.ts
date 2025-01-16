import {
  type DataAvailabilityMode,
  ProjectService,
  type ProjectWith,
  type ScalingProjectCategory,
  type ScalingProjectStack,
} from '@l2beat/config'
import { TrackedTxsConfigSubtypeValues, UnixTime } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import {
  type CommonScalingEntry,
  getCommonScalingEntry2,
} from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { getLiveness } from './get-liveness'
import { type LivenessDetails, type LivenessProject } from './types'
import {
  type AnomalyIndicatorEntry,
  toAnomalyIndicatorEntries,
} from './utils/get-anomaly-entries'
import { getLivenessNotSyncedStatus } from './utils/get-liveness-not-synced-status'

export async function getScalingLivenessEntries() {
  const [tvl, projectsChangeReport, liveness, projects] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    getLiveness(),
    ProjectService.STATIC.getProjects({
      select: ['statuses', 'scalingInfo'],
      optional: ['countdowns', 'livenessInfo', 'scalingDa'],
      where: ['isScaling'],
      whereNot: ['isUpcoming', 'isArchived'],
    }),
  ])

  // TODO: In the future select by livenessInfo being present instead
  // We cannot do this now because it can be missing. Future refactor should
  // make it so that if and only if trackedTxs are configured for liveness
  // livenessInfo is present
  const activeProjects = projects.filter(
    (x) =>
      x.scalingInfo.type === 'Optimistic Rollup' ||
      x.scalingInfo.type === 'ZK Rollup',
  )

  const entries = activeProjects
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
  project: ProjectWith<
    'scalingInfo' | 'statuses',
    'countdowns' | 'livenessInfo' | 'scalingDa'
  >,
  changes: ProjectChanges,
  liveness: LivenessProject | undefined,
  tvl: number | undefined,
): ScalingLivenessEntry | undefined {
  if (!liveness) {
    return undefined
  }

  const lowestSyncedUntil = getLowestSyncedUntil(liveness)
  const notSyncedStatus = getLivenessNotSyncedStatus(lowestSyncedUntil)
  const data = getLivenessData(liveness, project, !notSyncedStatus)
  return {
    ...getCommonScalingEntry2({
      project,
      changes,
      syncStatuses: compact([notSyncedStatus]),
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
  isSynced: boolean
}

function getLivenessData(
  liveness: LivenessProject,
  project: ProjectWith<never, 'livenessInfo'>,
  isSynced: boolean,
): LivenessData {
  return {
    stateUpdates: getSubTypeData(
      liveness.stateUpdates,
      project.livenessInfo?.warnings?.stateUpdates,
    ),
    batchSubmissions: getSubTypeData(
      liveness.batchSubmissions,
      project.livenessInfo?.warnings?.batchSubmissions,
    ),
    proofSubmissions: getSubTypeData(
      liveness.proofSubmissions,
      project.livenessInfo?.warnings?.proofSubmissions,
    ),
    isSynced,
  }
}

function getLowestSyncedUntil(liveness: LivenessProject): UnixTime {
  let lowestSyncedUntil = UnixTime.now()

  for (const subtype of TrackedTxsConfigSubtypeValues) {
    const data = liveness[subtype]
    if (!data) {
      continue
    }
    const syncedUntil = new UnixTime(data.syncedUntil)
    if (syncedUntil.lt(lowestSyncedUntil)) {
      lowestSyncedUntil = syncedUntil
    }
  }
  return lowestSyncedUntil
}

export interface LivenessTypeData {
  '30d': LivenessDatapoint | undefined
  '90d': LivenessDatapoint | undefined
  max: LivenessDatapoint | undefined
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
): LivenessTypeData | undefined {
  if (!data) return undefined
  return {
    '30d': data['30d'],
    '90d': data['90d'],
    max: data.max,
    warning,
  }
}
