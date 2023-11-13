import { Layer2 } from '@l2beat/config'
import {
  assertUnreachable,
  LivenessApiProject,
  LivenessApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { AnomalyIndicatorEntry } from '../../../../components/AnomalyIndicator'
import { ScalingLivenessViewEntry } from '../types'
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
  const liveness = livenessResponse.projects[project.display.slug]
  return {
    name: project.display.name,
    slug: project.display.slug,
    warning: project.display.warning,
    category: project.display.category,
    provider: project.display.provider,
    stage: project.stage,
    stateUpdates: liveness?.stateUpdates,
    batchSubmissions: liveness?.batchSubmissions,
    anomalyEntries: getAnomalyEntries(liveness?.anomalies),
  }
}

function getAnomalyEntries(
  anomalies: LivenessApiProject['anomalies'],
): AnomalyIndicatorEntry[] {
  if (!anomalies || anomalies.length === 0) {
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
      result.push({
        isAnomaly: true,
        anomalies: anomaliesInGivenDay.map((a) => ({
          type: typeToDisplayType(a),
          timestamp: a.timestamp.toNumber(),
          durationInSeconds: a.durationInSeconds,
        })),
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
      return 'BATCH SUBMISSION'
    case 'STATE':
      return 'STATE UPDATE'
    default:
      assertUnreachable(anomaly.type)
  }
}
