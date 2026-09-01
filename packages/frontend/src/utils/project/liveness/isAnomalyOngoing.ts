import type { LivenessAnomaly } from '~/server/features/layer2s/liveness/types'

export function isAnomalyOngoing(anomaly: LivenessAnomaly) {
  return anomaly.status === 'ongoing'
}
