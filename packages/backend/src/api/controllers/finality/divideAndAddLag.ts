import { LivenessDataPoint } from '@l2beat/shared-pure'

export function divideAndAddLag(
  details: LivenessDataPoint | undefined,
  lag: number,
) {
  if (!details) return undefined
  return {
    averageInSeconds: Math.ceil(details.averageInSeconds / 2 + lag),
    minimumInSeconds: Math.ceil(details.minimumInSeconds / 2 + lag),
    maximumInSeconds: Math.ceil(details.maximumInSeconds / 2 + lag),
  }
}
