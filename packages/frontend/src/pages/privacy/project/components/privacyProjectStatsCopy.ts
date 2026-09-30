import type { PrivacyRelayerStat } from '~/server/features/privacy/types'

/** In a .ts file so the server-side markdown can use it without bundling React components. */
export const PRIVACY_PROJECT_STATS_COPY = {
  totalValueLocked: 'Total Value Locked',
  assetsTracked: 'Assets tracked',
  bucketsTracked: 'Buckets tracked',
  deposits7d: 'Deposits 7D',
  deposits30d: 'Deposits 30D',
  depositsTotal: 'Deposits Total',
  notTracked: 'Not tracked',
  untrackedMetrics: {
    title: 'Metrics',
    description: 'Data tracking is not available for this project.',
  },
  untrackedAssetMetrics: {
    title: 'Live asset metrics',
    description: 'Onchain asset monitoring is not available for this project.',
  },
} as const

export const RELAYER_STAT_COPY: Record<
  PrivacyRelayerStat['kind'],
  { title: string; tooltip: string }
> = {
  activeRelayers: {
    title: 'Active Relayers 30D',
    tooltip:
      'The number of unique relayer addresses observed in relayed withdrawals over the past 30 days.',
  },
  avgDailyRelayers: {
    title: 'Avg. Relayers 30D',
    tooltip:
      'The average number of unique relayers seen advertising their services in daily network observations over the past 30 days.',
  },
}
