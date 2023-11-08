import { Layer2 } from '@l2beat/config'
import {
  LivenessApiProject,
  LivenessApiResponse,
  UnixTime,
} from '@l2beat/shared-pure'

import { AnomalyIndicatorEntry } from '../../../../components/AnomalyIndicator'
import { ScalingLivenessViewEntry } from '../types'
import { ScalingLivenessViewProps } from '../view/ScalingLivenessView'

export function getScalingLivenessView(
  projects: Layer2[],
  livenessResponse: LivenessApiResponse,
): ScalingLivenessViewProps {
  return {
    items: projects
      .filter((p) => !p.isUpcoming && !p.isArchived)
      .map((p) => getScalingLivenessViewEntry(p, livenessResponse)),
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
  if (!anomalies || anomalies.length !== 0) {
    return []
  }

  const now = UnixTime.now()
  const thirtyDaysAgo = now.add(-30, 'days')
  let dayInLoop = thirtyDaysAgo
  const result: AnomalyIndicatorEntry[] = []

  // TODO: (liveness) Do we want to include the current day?
  while (dayInLoop.lt(now)) {
    // TODO: (liveness) Check sorting later
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
          timestamp: a.timestamp.toNumber(),
          durationInSeconds: a.durationInSeconds,
        })),
      })
    }

    dayInLoop = dayInLoop.add(1, 'days')
  }
  return result
}
