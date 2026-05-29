import type { ProjectEthereumLikeInclusionDelayChart } from '@l2beat/config'
import { calculateSingleProposerDelayDays, validateBaseChart } from './shared'
import type { InclusionDelayModel } from './types'

export function createEthereumLikeModel(
  chart: ProjectEthereumLikeInclusionDelayChart,
): InclusionDelayModel {
  validate(chart)
  return {
    validatorCount: chart.validatorCount,
    maxCensorFraction: chart.maxCensorFraction,
    target: chart.target,
    calculateDelayDays: (censorCount) =>
      calculateEthereumLikeDelayDays(chart, censorCount),
    criticalCensorCounts: [
      Math.floor((chart.validatorCount - 1) / 2),
      Math.ceil(chart.validatorCount / 2),
    ],
    supportsFractionalCensorCount: true,
  }
}

export function calculateEthereumLikeDelayDays(
  chart: ProjectEthereumLikeInclusionDelayChart,
  censorCount: number,
): number | null {
  return calculateSingleProposerDelayDays({
    validatorCount: chart.validatorCount,
    censorCount,
    target: chart.target,
    firstOpportunitySeconds: chart.slotSeconds,
    missedOpportunitySeconds: chart.slotSeconds,
    minHonestFraction: 0.5,
  })
}

function validate(chart: ProjectEthereumLikeInclusionDelayChart) {
  validateBaseChart(chart)
  if (chart.slotSeconds <= 0) {
    throw new Error('slotSeconds must be greater than 0')
  }
}
