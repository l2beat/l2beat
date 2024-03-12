import { Layer2 } from '@l2beat/config'
import {
  assertUnreachable,
  LivenessApiProject,
  LivenessApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { orderByTvl } from '../../../../utils/orderByTvl'
import {
  AnomalyIndicatorEntry,
  LivenessPagesData,
  ScalingLivenessViewEntry,
} from '../types'
import { ScalingLivenessViewProps } from '../view/ScalingLivenessView'

export function getScalingLivenessView(
  projects: Layer2[],
  pagesData: LivenessPagesData,
): ScalingLivenessViewProps {
  const { tvlApiResponse, livenessApiResponse } = pagesData
  const included = getIncludedProjects(projects, livenessApiResponse)
  const ordered = orderByTvl(included, tvlApiResponse)

  return {
    items: ordered.map((p) =>
      getScalingLivenessViewEntry(p, livenessApiResponse),
    ),
  }
}

function getScalingLivenessViewEntry(
  project: Layer2,
  livenessResponse: LivenessApiResponse,
): ScalingLivenessViewEntry {
  const liveness = livenessResponse.projects[project.id.toString()]
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
    category: project.display.category,
    dataAvailabilityMode: project.dataAvailability?.mode,
    provider: project.display.provider,
    stage: project.stage,
    explanation: project.display.liveness?.explanation,
    stateUpdates: {
      ...liveness.stateUpdates,
      warning: project.display.liveness?.warnings?.stateUpdates,
    },
    batchSubmissions: {
      ...liveness.batchSubmissions,
      warning: project.display.liveness?.warnings?.batchSubmissions,
    },
    proofSubmissions: {
      ...liveness.proofSubmissions,
      warning: project.display.liveness?.warnings?.proofSubmissions,
    },
    anomalyEntries: getAnomalyEntries(liveness.anomalies),
    isSynced: liveness.isSynced,
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
    case 'DA':
      return 'TX DATA SUBMISSION'
    case 'STATE':
      return 'STATE UPDATE'
    case 'PROOF':
      return 'PROOF SUBMISSION'
    default:
      assertUnreachable(anomaly.type)
  }
}
