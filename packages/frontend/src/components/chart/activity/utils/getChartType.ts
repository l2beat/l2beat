import type { ProjectScalingCategory } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { ActivityChartType } from '../ActivityChart'

export function getChartType(
  category?: ProjectScalingCategory,
): ActivityChartType {
  switch (category) {
    case 'Optimistic Rollup':
    case 'ZK Rollup':
      return 'Rollups'
    case 'Validium':
    case 'Optimium':
      return 'ValidiumsAndOptimiums'
    case 'Other':
    case undefined:
    case 'Plasma':
      return 'Others'
    default:
      assertUnreachable(category)
  }
}
