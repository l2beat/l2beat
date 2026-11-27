import {
  GAS_FEES_METRICS,
  type GasFeesMetric,
  isGasMetric,
} from '~/server/features/gas-fees/daily/metrics'

export type FeeUnit = 'usd' | 'gas'

/** Each metric's short name, for a tab or an option, and its full title */
export const METRIC_LABELS: Record<
  GasFeesMetric,
  { tab: string; title: string }
> = {
  avgFee: { tab: 'Avg fee', title: 'Average fee per transaction' },
  medianFee: { tab: 'Median fee', title: 'Median fee per transaction' },
  transfer: { tab: 'ETH transfer', title: 'Cost of an ETH transfer' },
  erc20: { tab: 'ERC-20', title: 'Cost of an ERC-20 transfer' },
  swap: { tab: 'Swap', title: 'Cost of a swap' },
  gasPrice: { tab: 'Gas price', title: 'Gas price' },
  baseFee: { tab: 'Base fee', title: 'Base fee per gas' },
  priorityFee: { tab: 'Priority fee', title: 'Priority fee per gas' },
}

export const DEFAULT_METRIC = 'erc20' satisfies GasFeesMetric

export function unitOf(metric: GasFeesMetric): FeeUnit {
  return isGasMetric(metric) ? 'gas' : 'usd'
}

export function metricsOf(unit: FeeUnit): GasFeesMetric[] {
  return GAS_FEES_METRICS.filter((metric) => unitOf(metric) === unit)
}
