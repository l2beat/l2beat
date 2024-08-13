import { type Layer2, layer2s } from '@l2beat/config'
import {
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../implementation-change-report/get-implementation-change-report'
import { toAnomalyIndicatorEntries } from '../liveness/get-anomaly-entries'
import { getLiveness } from '../liveness/get-liveness'
import { type LivenessProject } from '../liveness/types'
import { getLatestTvlUsd } from '../tvl/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/order-by-tvl'
import { getProjectsVerificationStatuses } from '../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from './get-common-scaling-entry'

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

      return {
        ...getCommonScalingEntry({
          project,
          hasImplementationChanged,
          isVerified,
        }),
        entryType: 'liveness' as const,
        data: getLivenessData(projectLiveness, project),
        explanation: project.display.liveness?.explanation,
        anomalies: toAnomalyIndicatorEntries(projectLiveness.anomalies ?? []),
        dataAvailabilityMode: project.dataAvailability?.mode,
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
