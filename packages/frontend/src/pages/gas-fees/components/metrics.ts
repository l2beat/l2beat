import { formatCurrency } from '@l2beat/shared-pure'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import type { GasFeesMetric } from '~/server/features/gas-fees/types'
import { getFirstTwoNonZeroPrecision } from '~/utils/getFirstTwoNonZeroPrecision'
import type { ChartRange } from '~/utils/range/range'

export const DEFAULT_GAS_FEES_METRIC: GasFeesMetric = 'avgFee'

export const GAS_FEES_METRIC_LABELS: Record<
  GasFeesMetric,
  { short: string; title: string; description: string }
> = {
  avgFee: {
    short: 'Avg fee',
    title: 'Average fee per transaction',
    description: 'Fees paid divided by transactions',
  },
  medianFee: {
    short: 'Median fee',
    title: 'Median fee per transaction',
    description: 'What the middle transaction paid',
  },
  transfer: {
    short: 'ETH transfer',
    title: 'Cost of an ETH transfer',
    description: '21,000 gas at the typical fee',
  },
  erc20: {
    short: 'ERC-20',
    title: 'Cost of an ERC-20 transfer',
    description: '65,000 gas at the typical fee',
  },
  swap: {
    short: 'Swap',
    title: 'Cost of a token swap',
    description: '180,000 gas at the typical fee',
  },
}

/** Two significant digits below a dollar: fees span $100 to a hundredth of a cent */
export function formatFee(value: number) {
  if (value >= 1) return formatCurrency(value, 'usd')
  return formatCurrency(value, 'usd', {
    decimals: Math.max(2, getFirstTwoNonZeroPrecision(value)),
  })
}

/** For log axis ticks, which are powers of ten: "$0.001", not "$0.0010" */
export function formatFeeTick(value: number) {
  if (value >= 1) return formatCurrency(value, 'usd', { decimals: 0 })
  return `$${Number(value.toPrecision(1))}`
}

export function formatTimes(value: number) {
  return `${value >= 10 ? Math.round(value).toLocaleString('en-US') : value.toFixed(1)}×`
}

export const GAS_FEES_RANGE_OPTIONS = ['7d', '30d', '90d', '1y', 'max'] as const

/** How the selected range reads in a sentence: "past year", "all time" */
export function getPeriodLabel(range: ChartRange) {
  switch (rangeToOption(range, GAS_FEES_RANGE_OPTIONS)) {
    case '7d':
      return 'past 7 days'
    case '30d':
      return 'past 30 days'
    case '90d':
      return 'past 90 days'
    case '1y':
      return 'past year'
    case 'max':
      return 'all time'
    default:
      return 'selected period'
  }
}
