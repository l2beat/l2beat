import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import {
  type EthereumAddress,
  type LivenessApiProject,
  type LivenessApiResponse,
  type ProjectId,
  TrackedTxsConfigSubtypeValues,
  UnixTime,
  assertUnreachable,
  notUndefined,
} from '@l2beat/shared-pure'
import { orderByTvl } from '../tvl/order-by-tvl'
import {
  type ScalingLivenessEntry,
  type ScalingDataAvailabilityEntry,
} from './types'
import { getCommonScalingEntry } from './get-common-scaling-entry'
import { formatTimestamp } from '~/utils/dates'

export async function getScalingLivenessEntries({
  tvl,
  liveness,
  implementationChangeReport,
  projectsVerificationStatuses,
}: {
  liveness: LivenessApiResponse
  tvl: Record<ProjectId, number>
  projectsVerificationStatuses: Record<string, boolean | undefined>
  implementationChangeReport: {
    projects: Record<
      string,
      Record<
        string,
        {
          containingContract: EthereumAddress
          newImplementations: EthereumAddress[]
        }[]
      >
    >
  }
}): Promise<ScalingDataAvailabilityEntry[]> {
  const activeProjects = [...layer2s].filter(
    (p) => !p.isUpcoming && !(p.type === 'layer2' && p.isArchived),
  )
  const orderedByTvl = orderByTvl(activeProjects, tvl)

  return orderedByTvl
    .map((p) => {
      const hasImplementationChanged =
        !!implementationChangeReport.projects[p.id.toString()]
      const isVerified = !!projectsVerificationStatuses[p.id.toString()]
      const data = getLivenessData(liveness.projects[p.id.toString()], p)
      const explanation = p.display.liveness?.explanation
      const anomalies = getAnomalyEntries(
        liveness.projects[p.id.toString()]?.anomalies,
      )
      return getScalingLivenessEntry(
        p,
        hasImplementationChanged,
        isVerified,
        livenessData,
      )
    })
    .filter(notUndefined)
}

function getScalingLivenessEntry(
  project: Layer2 | Layer3,
  hasImplementationChanged: boolean,
  isVerified: boolean,
  livenessData: ReturnType<typeof getLivenessData>,
): ScalingLivenessEntry | undefined {
  if (!project.dataAvailability) return

  return {
    ...getCommonScalingEntry({ project, hasImplementationChanged, isVerified }),
    liveness: livenessData,
  }
}

function getLivenessData(
  liveness: LivenessApiResponse['projects'][string],
  project: Layer2,
) {
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

export function getSyncStatus(syncedUntil: UnixTime, syncTarget: UnixTime) {
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

function getAnomalyEntries(anomalies: LivenessApiProject['anomalies']) {
  if (!anomalies) {
    return []
  }

  const now = UnixTime.now()
  // We want to show last 30 days with today included so we start 29 days ago
  const thirtyDaysAgo = now.add(-29, 'days')
  let dayInLoop = thirtyDaysAgo
  const result: (
    | { isAnomaly: boolean }
    | {
        isAnomaly: true
        anomalies: {
          type?: string
          timestamp: number
          durationInSeconds: number
        }[]
      }
  )[] = []

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
