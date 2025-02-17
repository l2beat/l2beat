import type { ScalingProjectCategory } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type { ActivityChartType } from '../activity-chart'

export function getChartType(
  category?: ScalingProjectCategory,
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
