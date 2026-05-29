import type { ProjectSpanLikeInclusionDelayChart } from '@l2beat/config'
import { calculateSingleProposerDelayDays, validateBaseChart } from './shared'
import type { InclusionDelayModel } from './types'

export function createSpanLikeModel(
  chart: ProjectSpanLikeInclusionDelayChart,
): InclusionDelayModel {
  validate(chart)
  return {
    validatorCount: chart.validatorCount,
    maxCensorFraction: chart.maxCensorFraction,
    target: chart.target,
    calculateDelayDays: (censorCount) =>
      calculateSpanLikeDelayDays(chart, censorCount),
    criticalCensorCounts: [
      Math.ceil(chart.validatorCount / 3) - 1,
      Math.ceil(chart.validatorCount / 3),
    ],
    supportsFractionalCensorCount: true,
  }
}

export function calculateSpanLikeDelayDays(
  chart: ProjectSpanLikeInclusionDelayChart,
  censorCount: number,
): number | null {
  return calculateSingleProposerDelayDays({
    validatorCount: chart.validatorCount,
    censorCount,
    target: chart.target,
    firstOpportunitySeconds: chart.blockSeconds,
    missedOpportunitySeconds: chart.spanBlocks * chart.blockSeconds,
    minHonestFraction: 2 / 3,
  })
}

function validate(chart: ProjectSpanLikeInclusionDelayChart) {
  validateBaseChart(chart)
  if (chart.spanBlocks <= 0) {
    throw new Error('spanBlocks must be greater than 0')
  }
  if (chart.blockSeconds <= 0) {
    throw new Error('blockSeconds must be greater than 0')
  }
}
