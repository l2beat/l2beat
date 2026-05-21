import type { ProjectCommitteeInclusionDelayConfig } from '@l2beat/config'

import { ceilWithTolerance, getLogFactorials, logChoose } from '../mathUtils'

export function calculateCommitteeDelaySeconds(
  config: ProjectCommitteeInclusionDelayConfig,
  censorCount: number,
): number | null {
  if (censorCount === 0) return config.slotSeconds

  const probabilities = getCommitteeCensorProbabilities(
    config.validatorCount,
    config.committeeSize,
    censorCount,
  )

  const survivalAtSlots = (slots: number) => {
    return probabilities.reduce((sum, { censoringCommitteeMembers, p }) => {
      const pointSurvival =
        censoringCommitteeMembers > config.blockingThreshold
          ? 1
          : (censoringCommitteeMembers / config.committeeSize) ** slots

      return sum + p * pointSurvival
    }, 0)
  }

  const targetSurvival = 1 - config.targetPercentile
  const residualSurvival = Array.from({ length: config.epochSlots }, (_, i) =>
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

    const candidateSlots = fullEpochs * config.epochSlots + residualSlots
    targetSlots =
      targetSlots === undefined
        ? candidateSlots
        : Math.min(targetSlots, candidateSlots)
  }

  if (targetSlots === undefined) return null
  return targetSlots * config.slotSeconds
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

function getCommitteeCensorProbabilities(
  validatorCount: number,
  committeeSize: number,
  censorCount: number,
) {
  const logFactorials = getLogFactorials(validatorCount)
  const denominator = logChoose(validatorCount, committeeSize, logFactorials)
  const minCensors = Math.max(0, committeeSize - (validatorCount - censorCount))
  const maxCensors = Math.min(committeeSize, censorCount)

  return Array.from(
    { length: maxCensors - minCensors + 1 },
    (_, i) => minCensors + i,
  ).map((censoringCommitteeMembers) => {
    const p = Math.exp(
      logChoose(censorCount, censoringCommitteeMembers, logFactorials) +
        logChoose(
          validatorCount - censorCount,
          committeeSize - censoringCommitteeMembers,
          logFactorials,
        ) -
        denominator,
    )

    return { censoringCommitteeMembers, p }
  })
}
