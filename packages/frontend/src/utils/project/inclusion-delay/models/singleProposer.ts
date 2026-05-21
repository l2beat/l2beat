import { ceilWithTolerance } from '../mathUtils'

export function calculateSingleProposerDelaySeconds({
  validatorCount,
  censorCount,
  targetPercentile,
  firstOpportunitySeconds,
  missedOpportunitySeconds,
  minHonestFraction,
}: {
  validatorCount: number
  censorCount: number
  targetPercentile: number
  firstOpportunitySeconds: number
  missedOpportunitySeconds: number
  minHonestFraction: number
}): number | null {
  const honestCount = validatorCount - censorCount
  if (honestCount <= minHonestFraction * validatorCount) return null

  const honestOpportunityProbability = honestCount / validatorCount
  if (honestOpportunityProbability >= 1) {
    return firstOpportunitySeconds
  }

  if (honestOpportunityProbability <= 0) return null

  const targetOpportunities = ceilWithTolerance(
    Math.log(1 - targetPercentile) / Math.log(1 - honestOpportunityProbability),
  )
  return (
    (targetOpportunities - 1) * missedOpportunitySeconds +
    firstOpportunitySeconds
  )
}
