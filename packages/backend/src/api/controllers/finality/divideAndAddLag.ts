import { LivenessDataPoint } from '@l2beat/shared-pure'

export function divideAndAddLag(
  details: LivenessDataPoint | undefined,
  lag: number,
) {
  if (!details) return undefined
  return {
    averageInSeconds: details.averageInSeconds / 2 + lag,
    minimumInSeconds: details.minimumInSeconds / 2 + lag,
    maximumInSeconds: details.maximumInSeconds / 2 + lag,
  }
}
