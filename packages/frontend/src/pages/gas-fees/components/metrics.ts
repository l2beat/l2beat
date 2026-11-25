import { formatCurrency } from '@l2beat/shared-pure'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import type {
  GasFeesGasMetric,
  GasFeesMetric,
  GasFeesUsdMetric,
} from '~/server/features/gas-fees/types'
import { getFirstTwoNonZeroPrecision } from '~/utils/getFirstTwoNonZeroPrecision'
import type { ChartRange } from '~/utils/range/range'

export const DEFAULT_GAS_FEES_METRIC: GasFeesUsdMetric = 'erc20'
export const DEFAULT_GAS_FEES_GAS_METRIC: GasFeesGasMetric = 'gasPrice'

export const GAS_FEES_METRIC_LABELS: Record<
  GasFeesMetric,
  { short: string; title: string }
> = {
  avgFee: {
    short: 'Avg fee',
    title: 'Average fee per transaction',
  },
  medianFee: {
    short: 'Median fee',
    title: 'Median fee per transaction',
  },
  transfer: {
    short: 'ETH transfer',
    title: 'Cost of an ETH transfer',
  },
  erc20: {
    short: 'ERC-20',
    title: 'Cost of an ERC-20 transfer',
  },
  swap: {
    short: 'Swap',
    title: 'Cost of a token swap',
  },
  gasPrice: {
    short: 'Gas price',
    title: 'Average gas price',
  },
  baseFeePerGas: {
    short: 'Base fee',
    title: 'Base fee per gas',
  },
  priorityFeePerGas: {
    short: 'Priority fee',
    title: 'Priority fee per gas',
  },
}

/** Two significant digits below a dollar: fees span $100 to a hundredth of a cent */
export function formatFee(value: number) {
  // Without a nonzero digit to find, the precision runs away
  if (value === 0) return formatCurrency(0, 'usd', { decimals: 2 })
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

/** Per gas: "24 gwei", "0.012 gwei" */
export function formatGasPrice(value: number) {
  return `${formatGasNumber(value)} gwei`
}

export function formatGasNumber(value: number) {
  if (value >= 10_000) {
    return Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumSignificantDigits: 3,
    }).format(value)
  }
  if (value >= 100) return value.toFixed(0)
  if (value >= 10) return value.toFixed(1)
  if (value >= 1) return value.toFixed(2)
  return `${Number(value.toPrecision(2))}`
}

export function formatGasPriceTick(value: number) {
  return `${Number(value.toPrecision(1))}`
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
