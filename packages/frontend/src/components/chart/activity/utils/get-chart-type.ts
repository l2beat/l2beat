import { type ScalingProjectCategory } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import { type ActivityChartType } from '../use-activity-chart-render-params'

export function getChartType(category?: ScalingProjectCategory) {
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

export function typeToIndicator(type?: ActivityChartType) {
  switch (type) {
    case 'Rollups':
      return 'bg-indicator-rollups'
    case 'ValidiumsAndOptimiums':
      return 'bg-indicator-validiums-optimiums'
    case 'Others':
    case undefined:
      return 'bg-indicator-others'
    default:
      assertUnreachable(type)
  }
}
