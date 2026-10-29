import type { LiquidStakingSummary } from '~/server/features/defi/liquid-staking/getLiquidStakingSummary'
import { formatDays, formatYield } from './formatLiquidStaking'

export interface LiquidStakingMetric {
  key: keyof Pick<LiquidStakingSummary, 'yield' | 'costOfExit'>
  title: string
  tooltip: string
  format: (value: number) => string
}

export const YIELD_METRIC: LiquidStakingMetric = {
  key: 'yield',
  title: 'Yield',
  tooltip:
    "What a holder earned, net of protocol fees: the annualised change of the token's exchange rate over the previous 30 days.",
  format: formatYield,
}

export const COST_OF_EXIT_METRIC: LiquidStakingMetric = {
  key: 'costOfExit',
  title: 'Cost of exit',
  tooltip:
    'How many days of staking yield a holder gives up to exit, by the cheaper route: waiting for a protocol withdrawal, which earns nothing while queued, or selling at the market discount.',
  format: formatDays,
}

/** The chart values, also shown in the table and on project pages. */
export const LIQUID_STAKING_METRICS = [YIELD_METRIC, COST_OF_EXIT_METRIC]
