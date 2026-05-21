import { ETHEREUM_COMPARISON_SLOT_SECONDS } from './constants'
import { ceilWithTolerance } from './mathUtils'

export function calculateEthereumComparisonDelaySeconds({
  censoringFraction,
  targetPercentile,
  slotSeconds = ETHEREUM_COMPARISON_SLOT_SECONDS,
}: {
  censoringFraction: number
  targetPercentile: number
  slotSeconds?: number
}): number | null {
  if (censoringFraction >= 0.5) return null
  if (censoringFraction <= 0) return slotSeconds

  const targetSlots = ceilWithTolerance(
    Math.log(1 - targetPercentile) / Math.log(censoringFraction),
  )

  return targetSlots * slotSeconds
}
