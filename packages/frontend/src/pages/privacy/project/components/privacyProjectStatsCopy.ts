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
