import { formatCurrency, formatNumber } from '@l2beat/shared-pure'
import type { CostsUnit } from '~/server/features/layer2s/costs/types'
import type { CostsMetric } from '../components/CostsMetricContext'

export function formatCostValue(
  value: number,
  unit: CostsUnit,
  metric: CostsMetric = 'total',
) {
  if (unit === 'gas') {
    return formatNumber(value)
  }

  const decimals = metric === 'total' ? 2 : 6

  return formatCurrency(value, unit, { decimals })
}
