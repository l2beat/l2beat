import type { LivenessAnomaly } from '~/server/features/scaling/liveness/types'

export function isAnomalyOngoing(anomaly: LivenessAnomaly) {
  return anomaly.status === 'ongoing'
}
