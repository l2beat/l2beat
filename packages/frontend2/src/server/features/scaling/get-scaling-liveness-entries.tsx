import { type Layer2, layer2s } from '@l2beat/config'
import {
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getCommonScalingEntry } from './get-common-scaling-entry'
import { getLatestTvlUsd } from '../tvl/get-latest-tvl-usd'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { getLiveness } from '../liveness/get-liveness'
import { type LivenessDetails, type LivenessProject } from '../liveness/types'
import { toAnomalyIndicatorEntries } from '../liveness/get-anomaly-entries'
import { type } from 'os'
type
export async function getScalingLivenessEntries() {
  const [
    tvl,
    projectsVerificationStatuses,
    implementationChangeReport,
    liveness,
  ] = await Promise.all([
    getLatestTvlUsd(),
    getProjectsVerificationStatuses(),
    getImplementationChangeReport(),
    getLiveness(),
  ])

  const activeProjects = layer2s.filter(
    (p) =>
      liveness[p.id.toString()] &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup') &&
      !p.isUpcoming &&
      !p.isArchived,
  )

  const orderedByTvl = orderByTvl(activeProjects, tvl)

  return orderedByTvl
    .map((project) => {
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id.toString()]
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const projectLiveness = liveness[project.id.toString()]
      if (!projectLiveness) {
        return undefined
      }
      const data = getLivenessData(projectLiveness, project)
      const explanation = project.display.liveness?.explanation
      const anomalies = toAnomalyIndicatorEntries(
        projectLiveness.anomalies ?? [],
      )
      return {
        ...getCommonScalingEntry({
          project,
          hasImplementationChanged,
          isVerified,
        }),
        entryType: 'liveness' as const,
        data,
        explanation,
        anomalies,
      }
    })
    .filter(notUndefined)
}

export type ScalingLivenessEntry = Awaited<
  ReturnType<typeof getScalingLivenessEntries>
>[number]

function getLivenessData(liveness: LivenessProject, project: Layer2) {
  if (!liveness) return undefined

  let isSynced = true
  let lowestSyncedUntil: UnixTime = UnixTime.now()

  const syncTarget = UnixTime.now().add(-6, 'hours').toStartOf('hour')

  for (const subtype of TrackedTxsConfigSubtypeValues) {
    const syncedUntil = liveness[subtype]?.syncedUntil
    if (syncedUntil?.lt(syncTarget)) {
      isSynced = false
      if (syncedUntil.lt(lowestSyncedUntil)) {
        lowestSyncedUntil = syncedUntil
      }
    }
  }

  return {
    stateUpdates: getSubTypeData(project, liveness.stateUpdates, syncTarget),
    batchSubmissions: getSubTypeData(
      project,
      liveness.batchSubmissions,
      syncTarget,
    ),
    proofSubmissions: getSubTypeData(
      project,
      liveness.proofSubmissions,
      syncTarget,
    ),
    syncStatus: {
      isSynced,
      syncedUntil: lowestSyncedUntil.toNumber(),
    },
  }
}

function getSubTypeData(
  project: Layer2,
  data: LivenessDetails,
  syncTarget: UnixTime,
) {
  if (!data) return undefined

  return {
    '30d': data['30d'],
    '90d': data['90d'],
    max: data.max,
    syncStatus: getSyncStatus(data.syncedUntil, syncTarget),
    warning: project.display.liveness?.warnings?.stateUpdates,
  }
}

function getSyncStatus(syncedUntil: UnixTime, syncTarget: UnixTime) {
  const isSynced = syncedUntil?.gte(syncTarget) ?? false

  return {
    isSynced,
    syncedUntil: syncedUntil.toNumber(),
  }
}
