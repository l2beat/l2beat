import type { PrivacyRelayerStat } from '~/server/features/privacy/types'

/** In a .ts file so the server-side markdown can use it without bundling React components. */
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
