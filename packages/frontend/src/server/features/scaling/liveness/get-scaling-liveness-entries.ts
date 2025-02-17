import type {
  Project,
  ScalingProjectCategory,
  ScalingProjectStack,
  TableReadyValue,
} from '@l2beat/config'
import { TrackedTxsConfigSubtypeValues, UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { groupByTabs } from '~/utils/group-by-tabs'
import type { ProjectChanges } from '../../projects-change-report/get-projects-change-report'
import { getProjectsChangeReport } from '../../projects-change-report/get-projects-change-report'
import type { CommonScalingEntry } from '../get-common-scaling-entry'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvsUsd } from '../tvs/utils/get-latest-tvs-usd'
import { compareStageAndTvs } from '../utils/compare-stage-and-tvs'
import { getLiveness } from './get-liveness'
import type { LivenessAnomaly, LivenessDetails, LivenessProject } from './types'
import { getLivenessSyncWarning } from './utils/is-liveness-synced'

export async function getScalingLivenessEntries() {
  const [tvs, projectsChangeReport, liveness, projects] = await Promise.all([
    getProjectsLatestTvsUsd(),
    getProjectsChangeReport(),
    getLiveness(),
    ps.getProjects({
      select: ['statuses', 'scalingInfo', 'livenessInfo', 'display'],
      optional: ['scalingDa'],
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
        tvs[project.id],
      ),
    )
    .filter((x) => x !== undefined)
    .sort(compareStageAndTvs)

  return groupByTabs(entries)
}

export interface ScalingLivenessEntry extends CommonScalingEntry {
  category: ScalingProjectCategory
  stack: ScalingProjectStack | undefined
  data: LivenessData
  explanation: string | undefined
  anomalies: LivenessAnomaly[]
  dataAvailabilityMode: TableReadyValue | undefined
  tvsOrder: number
}

function getScalingLivenessEntry(
  project: Project<
    'scalingInfo' | 'statuses' | 'livenessInfo' | 'display',
    'scalingDa'
  >,
  changes: ProjectChanges,
  liveness: LivenessProject | undefined,
  tvs: number | undefined,
): ScalingLivenessEntry | undefined {
  if (!liveness) {
    return undefined
  }

  const lowestSyncedUntil = getLowestSyncedUntil(liveness)
  const syncWarning = getLivenessSyncWarning(lowestSyncedUntil)
  const data = getLivenessData(liveness, project, !syncWarning)
  return {
    ...getCommonScalingEntry({ project, changes, syncWarning }),
    category: project.scalingInfo.type,
    stack: project.scalingInfo.stack,
    data,
    explanation: project.livenessInfo?.explanation,
    anomalies: liveness.anomalies,
    dataAvailabilityMode: project.scalingDa?.mode,
    tvsOrder: tvs ?? -1,
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
  project: Project<'livenessInfo'>,
  isSynced: boolean,
): LivenessData {
  return {
    stateUpdates: getSubTypeData(
      liveness.stateUpdates,
      project.livenessInfo.warnings?.stateUpdates,
    ),
    batchSubmissions: getSubTypeData(
      liveness.batchSubmissions,
      project.livenessInfo.warnings?.batchSubmissions,
    ),
    proofSubmissions: getSubTypeData(
      liveness.proofSubmissions,
      project.livenessInfo.warnings?.proofSubmissions,
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
