import { MAX_PARTICLES_PER_FLOW, MAX_TOTAL_PARTICLES } from '../../consts'

export function getScaledParticleCounts(exactCounts: number[]): number[] {
  if (exactCounts.length === 0) return []

  // Keep the local ceiling, but preserve relative differences between flows.
  const maxExactCount = Math.max(...exactCounts)
  const localScale =
    maxExactCount > MAX_PARTICLES_PER_FLOW
      ? MAX_PARTICLES_PER_FLOW / maxExactCount
      : 1

  const locallyScaledCounts = exactCounts.map((count) => count * localScale)

  const totalCount = locallyScaledCounts.reduce((sum, count) => {
    if (count === 0) return sum
    return sum + count
  }, 0)

  const globalScale =
    totalCount > MAX_TOTAL_PARTICLES ? MAX_TOTAL_PARTICLES / totalCount : 1

  return locallyScaledCounts.map((count) => count * globalScale)
}
