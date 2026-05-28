import type { ProjectCommitteeLikeInclusionDelayChart } from '@l2beat/config'
import {
  getCommitteeCensorProbabilities,
  getLogFactorials,
} from './committeeMath'
import { ceilWithTolerance, SECONDS_PER_DAY, validateBaseChart } from './shared'
import type { InclusionDelayModel } from './types'

export function createCommitteeLikeModel(
  chart: ProjectCommitteeLikeInclusionDelayChart,
): InclusionDelayModel {
  validate(chart)
  const logFactorials = getLogFactorials(chart.validatorCount)
  return {
    validatorCount: chart.validatorCount,
    maxCensorFraction: chart.maxCensorFraction,
    target: chart.target,
    calculateDelayDays: (censorCount) =>
      calculateCommitteeLikeDelayDays(chart, censorCount, logFactorials),
    criticalCensorCounts: [],
  }
}

export function calculateCommitteeLikeDelayDays(
  chart: ProjectCommitteeLikeInclusionDelayChart,
  censorCount: number,
  logFactorials: number[] = getLogFactorials(chart.validatorCount),
): number | null {
  if (censorCount === 0) return chart.slotSeconds / SECONDS_PER_DAY

  const probabilities = getCommitteeCensorProbabilities(
    chart.validatorCount,
    chart.committeeSize,
    censorCount,
    logFactorials,
  )

  const survivalAtSlots = (slots: number) =>
    probabilities.reduce((sum, { censoringCommitteeMembers, p }) => {
      const pointSurvival =
        censoringCommitteeMembers > chart.blockingThreshold
          ? 1
          : (censoringCommitteeMembers / chart.committeeSize) ** slots

      return sum + p * pointSurvival
    }, 0)

  const targetSurvival = 1 - chart.target
  const residualSurvival = Array.from({ length: chart.epochSlots }, (_, i) =>
    survivalAtSlots(i + 1),
  )
  const epochSurvival = residualSurvival.at(-1)

  if (epochSurvival === undefined) {
    throw new Error('epochSlots must be greater than 0')
  }

  if (epochSurvival >= 1) return null

  let targetSlots: number | undefined
  for (const [i, survival] of residualSurvival.entries()) {
    const residualSlots = i + 1
    const fullEpochs = getRequiredFullEpochs(
      targetSurvival,
      survival,
      epochSurvival,
    )

    const candidateSlots = fullEpochs * chart.epochSlots + residualSlots
    targetSlots =
      targetSlots === undefined
        ? candidateSlots
        : Math.min(targetSlots, candidateSlots)
  }

  if (targetSlots === undefined) return null
  return (targetSlots * chart.slotSeconds) / SECONDS_PER_DAY
}

function getRequiredFullEpochs(
  targetSurvival: number,
  residualSurvival: number,
  epochSurvival: number,
) {
  if (residualSurvival <= targetSurvival) return 0
  if (residualSurvival <= 0) return 0
  if (epochSurvival <= 0) return 1

  return ceilWithTolerance(
    Math.log(targetSurvival / residualSurvival) / Math.log(epochSurvival),
  )
}

function validate(chart: ProjectCommitteeLikeInclusionDelayChart) {
  validateBaseChart(chart)
  if (chart.committeeSize <= 0 || chart.committeeSize > chart.validatorCount) {
    throw new Error('committeeSize must be between 1 and validatorCount')
  }
  if (chart.epochSlots <= 0) {
    throw new Error('epochSlots must be greater than 0')
  }
  if (chart.slotSeconds <= 0) {
    throw new Error('slotSeconds must be greater than 0')
  }
}
