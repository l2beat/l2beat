import type { ChartRangePredefinedOption } from '~/utils/range/range'

export const GAS_FEES_RANGES = [
  { value: '7d', label: '7D', period: 'past 7 days' },
  { value: '30d', label: '30D', period: 'past 30 days' },
  { value: '90d', label: '90D', period: 'past 90 days' },
  { value: '1y', label: '1Y', period: 'past year' },
  { value: 'max', label: 'MAX', period: 'all days stored' },
] as const satisfies {
  value: ChartRangePredefinedOption
  label: string
  period: string
}[]
export type GasFeesRangeOption = (typeof GAS_FEES_RANGES)[number]['value']

export const DEFAULT_CHART_RANGE: GasFeesRangeOption = 'max'
export const DEFAULT_TABLE_RANGE: GasFeesRangeOption = '30d'
