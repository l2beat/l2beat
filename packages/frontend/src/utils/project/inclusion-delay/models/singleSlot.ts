import type { ProjectSingleSlotInclusionDelayConfig } from '@l2beat/config'

import { calculateSingleProposerDelaySeconds } from './singleProposer'

export function calculateSingleSlotDelaySeconds(
  config: ProjectSingleSlotInclusionDelayConfig,
  censorCount: number,
): number | null {
  return calculateSingleProposerDelaySeconds({
    validatorCount: config.validatorCount,
    censorCount,
    targetPercentile: config.targetPercentile,
    firstOpportunitySeconds: config.slotSeconds,
    missedOpportunitySeconds: config.slotSeconds,
    minHonestFraction: 0.5,
  })
}
