import type { CostsUnit } from '~/server/features/scaling/costs/types'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { formatNumber } from '~/utils/number-format/format-number'
import type { CostsMetric } from '../_components/costs-metric-context'

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
