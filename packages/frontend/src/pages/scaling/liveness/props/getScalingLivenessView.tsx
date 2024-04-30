import { Layer2 } from '@l2beat/config'
import {
  assertUnreachable,
  ImplementationChangeReportApiResponse,
  LivenessApiProject,
  LivenessApiResponse,
  TrackedTxsConfigSubtypeValues,
  UnixTime,
} from '@l2beat/shared-pure'

import { formatTimestamp } from '../../../../utils'
import { orderByTvl } from '../../../../utils/orderByTvl'
import { SyncStatus } from '../../../types'
import {
  AnomalyIndicatorEntry,
  LivenessPagesData,
  ScalingLivenessViewEntry,
  ScalingLivenessViewEntryData,
} from '../types'
import { ScalingLivenessViewProps } from '../view/ScalingLivenessView'

export function getScalingLivenessView(
  projects: Layer2[],
  pagesData: LivenessPagesData,
): ScalingLivenessViewProps {
  const { tvlApiResponse, livenessApiResponse, implementationChange } =
    pagesData
  const included = getIncludedProjects(projects, livenessApiResponse)
  const ordered = orderByTvl(included, tvlApiResponse)

  return {
    items: ordered.map((p) =>
      getScalingLivenessViewEntry(p, livenessApiResponse, implementationChange),
    ),
  }
}

function getScalingLivenessViewEntry(
  project: Layer2,
  livenessResponse: LivenessApiResponse,
  implementationChange?: ImplementationChangeReportApiResponse,
): ScalingLivenessViewEntry {
  const liveness = livenessResponse.projects[project.id.toString()]
  const hasImplementationChanged =
    !!implementationChange?.projects[project.id.toString()]
  if (!liveness) {
    throw new Error(
      `Liveness data not found for project ${project.display.name}`,
    )
  }

  return {
    name: project.display.name,
    shortName: project.display.shortName,
    slug: project.display.slug,
    purposes: project.display.purposes,
    warning: project.display.warning,
    redWarning: project.display.redWarning,
    hasImplementationChanged,
    category: project.display.category,
    dataAvailabilityMode: project.dataAvailability?.mode,
    provider: project.display.provider,
    stage: project.stage,
    explanation: project.display.liveness?.explanation,
    anomalyEntries: getAnomalyEntries(liveness.anomalies),
    data: getLivenessData(liveness, project),
  }
}

function getLivenessData(
  liveness: LivenessApiResponse['projects'][string],
  project: Layer2,
): ScalingLivenessViewEntryData | undefined {
  if (!liveness) return undefined

  let isSynced = true
  let lowestSyncedUntil: UnixTime = UnixTime.now()

  const syncTarget = UnixTime.now().add(-6, 'hours').toStartOf('hour')

  TrackedTxsConfigSubtypeValues.forEach((subtype) => {
    const syncedUntil = liveness[subtype]?.syncedUntil
    if (syncedUntil?.lt(syncTarget)) {
      isSynced = false
      if (syncedUntil.lt(lowestSyncedUntil)) {
        lowestSyncedUntil = syncedUntil
      }
    }
  })

  return {
    stateUpdates: liveness.stateUpdates && {
      ...liveness.stateUpdates,
      warning: project.display.liveness?.warnings?.stateUpdates,
      syncStatus: getSyncStatus(liveness.stateUpdates.syncedUntil, syncTarget),
    },
    batchSubmissions: liveness.batchSubmissions && {
      ...liveness.batchSubmissions,
      warning: project.display.liveness?.warnings?.batchSubmissions,
      syncStatus: getSyncStatus(
        liveness.batchSubmissions.syncedUntil,
        syncTarget,
      ),
    },
    proofSubmissions: liveness.proofSubmissions && {
      ...liveness.proofSubmissions,
      warning: project.display.liveness?.warnings?.proofSubmissions,
      syncStatus: getSyncStatus(
        liveness.proofSubmissions.syncedUntil,
        syncTarget,
      ),
    },
    syncStatus: {
      isSynced,
      displaySyncedUntil: formatTimestamp(lowestSyncedUntil.toNumber(), {
        mode: 'datetime',
        longMonthName: true,
      }),
    },
  }
}

export function getSyncStatus(
  syncedUntil: UnixTime,
  syncTarget: UnixTime,
): SyncStatus {
  const isSynced = syncedUntil?.gte(syncTarget) ?? false
  if (isSynced) {
    return {
      isSynced,
    }
  }
  return {
    isSynced,
    displaySyncedUntil: `Values have not been synced since\n${formatTimestamp(
      syncedUntil.toNumber(),
      {
        mode: 'datetime',
        longMonthName: true,
      },
    )}.`,
  }
}

function getIncludedProjects(
  projects: Layer2[],
  livenessResponse: LivenessApiResponse | undefined,
) {
  return projects.filter(
    (p) =>
      livenessResponse?.projects[p.id.toString()] &&
      (p.display.category === 'Optimistic Rollup' ||
        p.display.category === 'ZK Rollup') &&
      !p.isUpcoming &&
      !p.isArchived,
  )
}

function getAnomalyEntries(
  anomalies: LivenessApiProject['anomalies'],
): AnomalyIndicatorEntry[] {
  if (!anomalies) {
    return []
  }

  const now = UnixTime.now()
  // We want to show last 30 days with today included so we start 29 days ago
  const thirtyDaysAgo = now.add(-29, 'days')
  let dayInLoop = thirtyDaysAgo
  const result: AnomalyIndicatorEntry[] = []

  while (dayInLoop.lte(now)) {
    const anomaliesInGivenDay = anomalies.filter((a) => {
      return a.timestamp.toYYYYMMDD() === dayInLoop.toYYYYMMDD()
    })

    if (anomaliesInGivenDay.length === 0) {
      result.push({
        isAnomaly: false,
      })
    } else {
      const anomalies = anomaliesInGivenDay.map(
        (a) =>
          ({
            type: typeToDisplayType(a),
            timestamp: a.timestamp.toNumber(),
            durationInSeconds: a.durationInSeconds,
          }) as const,
      )
      anomalies.sort((a, b) => a.timestamp - b.timestamp)
      result.push({
        isAnomaly: true,
        anomalies: anomalies,
      })
    }

    dayInLoop = dayInLoop.add(1, 'days')
  }
  return result
}

function typeToDisplayType(
  anomaly: NonNullable<LivenessApiProject['anomalies']>[0],
) {
  switch (anomaly.type) {
    case 'batchSubmissions':
      return 'TX DATA SUBMISSION'
    case 'stateUpdates':
      return 'STATE UPDATE'
    case 'proofSubmissions':
      return 'PROOF SUBMISSION'
    default:
      assertUnreachable(anomaly.type)
  }
}
