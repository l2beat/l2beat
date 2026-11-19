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
      'Unique relayer addresses seen in withdrawals over the past 30 days, without self-relays. One operator can use several addresses.',
  },
  avgDailyRelayers: {
    title: 'Avg. Relayers 30D',
    tooltip:
      'The average number of unique relayers seen advertising their services in daily network observations over the past 30 days.',
  },
}

/**
 * Which chains the value locked covers, when not all of them: then the sum is
 * of those only. Undefined when every chain's value is tracked.
 */
export function getPrivacyValueLockedCoverage(
  chains: { name: string; valueLocked?: unknown }[],
): string | undefined {
  const tracked = chains.filter((chain) => chain.valueLocked !== undefined)
  if (tracked.length === chains.length) return undefined
  if (tracked.length === 0) return 'not tracked on any chain'
  const names = tracked.map((chain) => chain.name)
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`
  return `on ${list} only`
}
