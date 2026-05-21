import type { ProjectInclusionDelayConfig } from '@l2beat/config'

import { calculateProjectDelaySeconds } from './calculateProjectDelay'
import { calculateEthereumComparisonDelaySeconds } from './ethereumComparison'

import { getCriticalCensorCounts, getSampledCensorCounts } from './mathUtils'
import type { InclusionDelaySeriesPoint } from './types'
import { validateInclusionDelayConfig } from './validateConfig'

export { calculateProjectDelaySeconds } from './calculateProjectDelay'
export { INCLUSION_DELAY_THRESHOLDS } from './constants'
export { getEntityStakeMarkers } from './entityStakeMarkers'
export { calculateEthereumComparisonDelaySeconds } from './ethereumComparison'
export { calculateCommitteeDelaySeconds } from './models/committee'
export { calculateSingleSlotDelaySeconds } from './models/singleSlot'
export { calculateSpanDelaySeconds } from './models/span'
export { getDelayThresholdMarkers } from './thresholdMarkers'
export type {
  DelayThreshold,
  DelayThresholdMarker,
  EntityStakeMarker,
  InclusionDelaySeriesPoint,
} from './types'

export function getInclusionDelaySeries(
  config: ProjectInclusionDelayConfig,
): InclusionDelaySeriesPoint[] {
  validateInclusionDelayConfig(config)

  const censorCounts = getSampledCensorCounts(
    config.validatorCount,
    config.maxCensoringFraction,
    getCriticalCensorCounts(config),
  )

  return censorCounts.map((censorCount) => {
    const censoringFraction = censorCount / config.validatorCount

    return {
      censoringFraction,
      projectDelaySeconds: calculateProjectDelaySeconds(config, censorCount),
      ethereumComparisonDelaySeconds: calculateEthereumComparisonDelaySeconds({
        censoringFraction,
        targetPercentile: config.targetPercentile,
      }),
    }
  })
}

export function calculateInclusionDelayForCensoringFraction(
  config: ProjectInclusionDelayConfig,
  censoringFraction: number,
): number | null {
  validateInclusionDelayConfig(config)

  if (
    !Number.isFinite(censoringFraction) ||
    censoringFraction < 0 ||
    censoringFraction > 1
  ) {
    throw new Error('censoringFraction must be between 0 and 1')
  }

  const censorCount = Math.round(config.validatorCount * censoringFraction)
  return calculateProjectDelaySeconds(config, censorCount)
}
