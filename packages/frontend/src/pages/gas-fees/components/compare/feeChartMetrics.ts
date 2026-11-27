import type { GasFeesMetric } from '~/server/features/gas-fees/daily/metrics'

export type FeeUnit = 'usd' | 'gas'

export const FEE_CHART_TABS: Record<
  FeeUnit,
  { metric: GasFeesMetric; tab: string; title: string }[]
> = {
  usd: [
    { metric: 'avgFee', tab: 'Avg fee', title: 'Average fee per transaction' },
    {
      metric: 'medianFee',
      tab: 'Median fee',
      title: 'Median fee per transaction',
    },
    {
      metric: 'transfer',
      tab: 'ETH transfer',
      title: 'Cost of an ETH transfer',
    },
    { metric: 'erc20', tab: 'ERC-20', title: 'Cost of an ERC-20 transfer' },
    { metric: 'swap', tab: 'Swap', title: 'Cost of a swap' },
  ],
  gas: [
    { metric: 'gasPrice', tab: 'Gas price', title: 'Gas price' },
    { metric: 'baseFee', tab: 'Base fee', title: 'Base fee per gas' },
    {
      metric: 'priorityFee',
      tab: 'Priority fee',
      title: 'Priority fee per gas',
    },
  ],
}

export const DEFAULT_CHART_METRIC = 'erc20' satisfies GasFeesMetric

export function unitOf(metric: GasFeesMetric): FeeUnit {
  return FEE_CHART_TABS.gas.some((t) => t.metric === metric) ? 'gas' : 'usd'
}

export function titleOf(metric: GasFeesMetric): string {
  return (
    [...FEE_CHART_TABS.usd, ...FEE_CHART_TABS.gas].find(
      (t) => t.metric === metric,
    )?.title ?? ''
  )
}
