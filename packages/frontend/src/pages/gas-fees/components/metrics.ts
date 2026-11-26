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
  return `$${formatSignificant(value, 1)}`
}

/** Never in e-notation: a tip or an L2's gas price can be 1e-8 gwei */
export function formatSignificant(value: number, digits: number) {
  return value.toLocaleString('en-US', { maximumSignificantDigits: digits })
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
  return formatSignificant(value, 2)
}

export function formatGasPriceTick(value: number) {
  return formatSignificant(value, 1)
}

/**
 * Where a value sits between two powers of ten on a log scale, from 0 to 1.
 * Rounded, because Math.log10 can differ in its last digit between the server
 * and a browser, which React reports as a hydration mismatch.
 */
export function logShare(value: number, lo: number, hi: number) {
  if (value <= 0) return 0
  const share = (Math.log10(value) - lo) / (hi - lo)
  return Math.round(Math.min(1, Math.max(0, share)) * 1e6) / 1e6
}

export function formatTimes(value: number) {
  return `${value >= 10 ? Math.round(value).toLocaleString('en-US') : value.toFixed(1)}×`
}

/** Ethereum's cost over a chain's, worded by which of the two is lower */
export function compareWithEthereum(times: number) {
  if (!Number.isFinite(times) || times <= 0) return undefined
  return times >= 1
    ? { times: formatTimes(times), word: 'cheaper', amount: 'less' }
    : { times: formatTimes(1 / times), word: 'more expensive', amount: 'more' }
}

export const GAS_FEES_RANGE_OPTIONS = ['7d', '30d', '90d', '1y', 'max'] as const

export const GAS_FEES_RANGE_LABELS: Record<
  (typeof GAS_FEES_RANGE_OPTIONS)[number],
  string
> = { '7d': '7D', '30d': '30D', '90d': '90D', '1y': '1Y', max: 'MAX' }

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
