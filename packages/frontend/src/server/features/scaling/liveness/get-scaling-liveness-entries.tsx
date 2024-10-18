import { type Layer2 } from '@l2beat/config'
import {
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { getImplementationChangeReport } from '../../implementation-change-report/get-implementation-change-report'
import { getLiveness } from './get-liveness'
import { type LivenessProject } from './types'

import { env } from '~/env'
import { groupByMainCategories } from '~/utils/group-by-main-categories'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import { getProjectsLatestTvlUsd } from '../tvl/utils/get-latest-tvl-usd'
import { orderByTvl } from '../tvl/utils/order-by-tvl'
import { orderByStageAndTvl } from '../utils/order-by-stage-and-tvl'
import { toAnomalyIndicatorEntries } from './utils/get-anomaly-entries'
import { getLivenessProjects } from './utils/get-liveness-projects'

export async function getScalingLivenessEntries() {
  const [
    tvl,
    projectsVerificationStatuses,
    implementationChangeReport,
    liveness,
  ] = await Promise.all([
    getProjectsLatestTvlUsd(),
    getProjectsVerificationStatuses(),
    getImplementationChangeReport(),
    getLiveness(),
  ])
  const activeProjects = getLivenessProjects()

  const entries = activeProjects
    .map((project) => {
      const hasImplementationChanged =
        !!implementationChangeReport.projects[project.id.toString()]
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const projectLiveness = liveness[project.id.toString()]
      if (!projectLiveness) {
        return undefined
      }

      return getScalingLivenessEntry(
        project,
        hasImplementationChanged,
        isVerified,
        projectLiveness,
      )
    })
    .filter(notUndefined)

  if (env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION) {
    return {
      type: 'recategorised' as const,
      entries: groupByMainCategories(orderByStageAndTvl(entries, tvl)),
    }
  }

  return { entries: orderByTvl(entries, tvl) }
}

export type ScalingLivenessEntry = Awaited<
  ReturnType<typeof getScalingLivenessEntry>
>
function getScalingLivenessEntry(
  project: Layer2,
  hasImplementationChanged: boolean,
  isVerified: boolean,
  liveness: LivenessProject,
) {
  return {
    ...getCommonScalingEntry({
      project,
      hasImplementationChanged,
      isVerified,
    }),
    entryType: 'liveness' as const,
    data: getLivenessData(liveness, project),
    explanation: project.display.liveness?.explanation,
    anomalies: toAnomalyIndicatorEntries(liveness.anomalies ?? []),
    dataAvailabilityMode: project.dataAvailability?.mode,
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
