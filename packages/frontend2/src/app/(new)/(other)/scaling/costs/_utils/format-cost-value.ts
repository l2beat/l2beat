import { type CostsDataBreakdown } from '~/server/features/scaling/get-scaling-costs-entries'
import { formatCurrency } from '~/utils/format'
import { formatNumber } from '~/utils/format-number'

export function formatCostValue(value: number, unit: keyof CostsDataBreakdown) {
  if (unit === 'gas') {
    return formatNumber(value)
  }

  return formatCurrency(value, unit)
}
