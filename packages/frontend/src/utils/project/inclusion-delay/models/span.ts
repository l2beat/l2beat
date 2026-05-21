import type { ProjectSpanInclusionDelayConfig } from '@l2beat/config'

import { calculateSingleProposerDelaySeconds } from './singleProposer'

export function calculateSpanDelaySeconds(
  config: ProjectSpanInclusionDelayConfig,
  censorCount: number,
): number | null {
  return calculateSingleProposerDelaySeconds({
    validatorCount: config.validatorCount,
    censorCount,
    targetPercentile: config.targetPercentile,
    firstOpportunitySeconds: config.blockSeconds,
    missedOpportunitySeconds: config.spanBlocks * config.blockSeconds,
    minHonestFraction: 2 / 3,
  })
}
