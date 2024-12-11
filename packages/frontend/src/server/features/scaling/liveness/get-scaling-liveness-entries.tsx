import { type Layer2 } from '@l2beat/config'
import {
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  notUndefined,
} from '@l2beat/shared-pure'
import { getLiveness } from './get-liveness'
import { type LivenessProject } from './types'

import { groupByTabs } from '~/utils/group-by-tabs'
import {
  type ProjectsChangeReport,
  getProjectsChangeReport,
} from '../../projects-change-report/get-projects-change-report'
import { getCurrentEntry } from '../../utils/get-current-entry'
import { getProjectsVerificationStatuses } from '../../verification-status/get-projects-verification-statuses'
import { getCommonScalingEntry } from '../get-common-scaling-entry'
import {
  ProjectsLatestTvlUsd,
  getProjectsLatestTvlUsd,
} from '../tvl/utils/get-latest-tvl-usd'
import { compareStageAndTvl } from '../utils/compare-stage-and-tvl'
import { toAnomalyIndicatorEntries } from './utils/get-anomaly-entries'
import { getLivenessProjects } from './utils/get-liveness-projects'

export async function getScalingLivenessEntries() {
  const [tvl, projectsVerificationStatuses, projectsChangeReport, liveness] =
    await Promise.all([
      getProjectsLatestTvlUsd(),
      getProjectsVerificationStatuses(),
      getProjectsChangeReport(),
      getLiveness(),
    ])
  const activeProjects = getLivenessProjects()

  const entries = activeProjects
    .map((project) => {
      const isVerified = !!projectsVerificationStatuses[project.id.toString()]
      const projectLiveness = liveness[project.id.toString()]
      if (!projectLiveness) {
        return undefined
      }

      return getScalingLivenessEntry(
        project,
        projectsChangeReport,
        isVerified,
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
  projectsChangeReport: ProjectsChangeReport,
  isVerified: boolean,
  liveness: LivenessProject,
  tvl: ProjectsLatestTvlUsd,
) {
  const dataAvailability = getCurrentEntry(project.dataAvailability)
  return {
    ...getCommonScalingEntry({
      project,
      hasImplementationChanged: projectsChangeReport.hasImplementationChanged(
        project.id,
      ),
      hasHighSeverityFieldChanged:
        projectsChangeReport.hasHighSeverityFieldChanged(project.id),
      isVerified,
    }),
    entryType: 'liveness' as const,
    data: getLivenessData(liveness, project),
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
