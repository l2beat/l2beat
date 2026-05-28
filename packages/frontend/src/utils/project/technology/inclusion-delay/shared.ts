export const SECONDS_PER_DAY = 86_400

export function validateBaseChart(chart: {
  validatorCount: number
  target: number
  maxCensorFraction: number
}) {
  if (chart.validatorCount <= 0) {
    throw new Error('validatorCount must be greater than 0')
  }
  if (chart.target <= 0 || chart.target >= 1) {
    throw new Error('target must be between 0 and 1')
  }
  if (chart.maxCensorFraction < 0 || chart.maxCensorFraction > 1) {
    throw new Error('maxCensorFraction must be between 0 and 1')
  }
}

export function ceilWithTolerance(value: number) {
  const rounded = Math.round(value)
  if (Math.abs(value - rounded) < 1e-12) return rounded

  return Math.ceil(value)
}

export function calculateSingleProposerDelayDays({
  validatorCount,
  censorCount,
  target,
  firstOpportunitySeconds,
  missedOpportunitySeconds,
  minHonestFraction,
}: {
  validatorCount: number
  censorCount: number
  target: number
  firstOpportunitySeconds: number
  missedOpportunitySeconds: number
  minHonestFraction: number
}): number | null {
  const honestCount = validatorCount - censorCount
  if (honestCount <= minHonestFraction * validatorCount) return null

  const honestOpportunityProbability = honestCount / validatorCount
  if (honestOpportunityProbability >= 1) {
    return firstOpportunitySeconds / SECONDS_PER_DAY
  }

  if (honestOpportunityProbability <= 0) return null

  const targetOpportunities = ceilWithTolerance(
    Math.log(1 - target) / Math.log(1 - honestOpportunityProbability),
  )
  const targetSeconds =
    (targetOpportunities - 1) * missedOpportunitySeconds +
    firstOpportunitySeconds

  return targetSeconds / SECONDS_PER_DAY
}
