import { type Layer2, getCurrentEntry } from '@l2beat/config'
import {
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectChanges,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  type ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { getLiveness } from './get-liveness'
import { type LivenessProject } from './types'
import { toAnomalyIndicatorEntries } from './utils/get-anomaly-entries'
import { getLivenessProjects } from './utils/get-liveness-projects'

export async function getScalingLivenessEntries() {
  const [tvl, projectsChangeReport, liveness] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsChangeReport(),
    getLiveness(),
  ])
  const activeProjects = getLivenessProjects()

  const entries = activeProjects
    .map((project) => {
      const projectLiveness = liveness[project.id.toString()]
      if (!projectLiveness) {
        return undefined
      }

      return getScalingLivenessEntry(
        project,
        projectsChangeReport.getChanges(project.id),
        projectLiveness,
        tvl,
      )
    })
    .filter(notUndefined)
    .sort(compareStageAndTvl)

  return groupByTabs(entries)
}

export type ScalingLivenessEntry = Awaited<
  ReturnType<typeof getScalingLivenessEntry>
>
function getScalingLivenessEntry(
  project: Layer2,
  changes: ProjectChanges,
  liveness: LivenessProject,
  tvl: ProjectsLatestTvlUsd,
) {
  const dataAvailability = getCurrentEntry(project.dataAvailability)
  const data = getLivenessData(liveness, project)
  return {
    ...getCommonScalingEntry({
      project,
      changes,
      syncStatus: data?.syncStatus,
    }),
    category: project.display.category,
    provider: project.display.provider,
    data,
    explanation: project.display.liveness?.explanation,
    anomalies: toAnomalyIndicatorEntries(liveness.anomalies ?? []),
    dataAvailabilityMode: dataAvailability?.mode,
    tvlOrder: tvl[project.id] ?? 0,
  }
}

function getLivenessData(liveness: LivenessProject, project: Layer2) {
  if (!liveness) return undefined

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
    stateUpdates: getSubTypeData(liveness, 'stateUpdates', project, syncTarget),
    batchSubmissions: getSubTypeData(
      liveness,
      'batchSubmissions',
      project,
      syncTarget,
    ),
    proofSubmissions: getSubTypeData(
      liveness,
      'proofSubmissions',
      project,
      syncTarget,
    ),
    syncStatus: {
      isSynced,
      syncedUntil: lowestSyncedUntil.toNumber(),
    },
  }
}

function getSubTypeData(
  data: LivenessProject,
  type: Exclude<keyof LivenessProject, 'anomalies'>,
  project: Layer2,
  syncTarget: UnixTime,
) {
  const typeData = data[type]
  if (!typeData) return undefined
  return {
    '30d': typeData['30d'],
    '90d': typeData['90d'],
    max: typeData.max,
    syncStatus: getSyncStatus(typeData.syncedUntil, syncTarget),
    warning: project.display.liveness?.warnings?.[type],
  }
}

function getSyncStatus(syncedUntil: number, syncTarget: UnixTime) {
  const isSynced = syncedUntil >= syncTarget.toNumber()

  return {
    isSynced,
    syncedUntil,
  }
}
