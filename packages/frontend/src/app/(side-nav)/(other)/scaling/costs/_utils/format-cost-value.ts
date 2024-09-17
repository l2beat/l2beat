import { type CostsUnit } from '~/server/features/scaling/costs/types'
import { formatCurrency } from '~/utils/format'
import { formatNumber } from '~/utils/format-number'
import { type CostsMetric } from '../_components/costs-metric-context'

export function formatCostValue(
  value: number,
  unit: CostsUnit,
  metric: CostsMetric = 'total',
  showLessThanMinimum = true,
) {
  if (unit === 'gas') {
    return formatNumber(value)
  }

  const decimals = metric === 'total' ? 2 : 6

  return formatCurrency(value, unit, { decimals, showLessThanMinimum })
}
