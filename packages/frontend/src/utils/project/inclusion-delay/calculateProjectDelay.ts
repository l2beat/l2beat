import type { ProjectInclusionDelayConfig } from '@l2beat/config'

import { calculateCommitteeDelaySeconds } from './models/committee'
import { calculateSingleSlotDelaySeconds } from './models/singleSlot'
import { calculateSpanDelaySeconds } from './models/span'

export function calculateProjectDelaySeconds(
  config: ProjectInclusionDelayConfig,
  censorCount: number,
): number | null {
  switch (config.type) {
    case 'singleSlot':
      return calculateSingleSlotDelaySeconds(config, censorCount)
    case 'span':
      return calculateSpanDelaySeconds(config, censorCount)
    case 'committee':
      return calculateCommitteeDelaySeconds(config, censorCount)
  }
}
