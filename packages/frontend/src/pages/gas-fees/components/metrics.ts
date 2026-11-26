import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import type {
  GasFeesGasMetric,
  GasFeesMetric,
  GasFeesUsdMetric,
} from '~/server/features/gas-fees/types'
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
