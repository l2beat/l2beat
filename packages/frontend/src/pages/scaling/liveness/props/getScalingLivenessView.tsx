import { Layer2 } from '@l2beat/config'
import {
  assertUnreachable,
  LivenessApiProject,
  LivenessApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { AnomalyIndicatorEntry, ScalingLivenessViewEntry } from '../types'
import { ScalingLivenessViewProps } from '../view/ScalingLivenessView'

export function getScalingLivenessView(
  projects: Layer2[],
  livenessResponse: LivenessApiResponse | undefined,
): ScalingLivenessViewProps {
  return {
    items: livenessResponse
      ? projects.map((p) => getScalingLivenessViewEntry(p, livenessResponse))
      : [],
  }
}

function getScalingLivenessViewEntry(
  project: Layer2,
  livenessResponse: LivenessApiResponse,
): ScalingLivenessViewEntry {
  const liveness = livenessResponse.projects[project.id.toString()]
  return {
    name: project.display.name,
    slug: project.display.slug,
    warning: project.display.warning,
    category: project.display.category,
    dataAvailabilityMode: project.display.dataAvailabilityMode,
    provider: project.display.provider,
    stage: project.stage,
    explanation: project.display.livenessExplanation,
    stateUpdates: liveness?.stateUpdates,
    batchSubmissions: liveness?.batchSubmissions,
    proofSubmissions: liveness?.proofSubmissions,
    anomalyEntries: getAnomalyEntries(liveness?.anomalies),
  }
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
          } as const),
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
