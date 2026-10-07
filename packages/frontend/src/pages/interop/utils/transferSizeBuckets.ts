import type { TransferSizeDistribution } from '~/server/features/layer2s/interop/utils/getTransferSizeChartData'

/** The transfer counts per size bucket, smallest bucket first. */
export function getTransferSizeBreakdown(
  transferSize: TransferSizeDistribution | undefined,
) {
  return [
    {
      ...transferSizeBuckets.under100,
      count: transferSize?.countUnder100 ?? 0,
    },
    {
      ...transferSizeBuckets.from100To1K,
      count: transferSize?.count100To1K ?? 0,
    },
    {
      ...transferSizeBuckets.from1KTo10K,
      count: transferSize?.count1KTo10K ?? 0,
    },
    {
      ...transferSizeBuckets.from10KTo100K,
      count: transferSize?.count10KTo100K ?? 0,
    },
    {
      ...transferSizeBuckets.over100K,
      count: transferSize?.countOver100K ?? 0,
    },
  ]
}

export const transferSizeBuckets = {
  under100: {
    label: 'Under $100',
    color: '#567FFF',
  },
  from100To1K: {
    label: '$100-$1K',
    color: '#7AE7C7',
  },
  from1KTo10K: {
    label: '$1K-$10K',
    color: '#F7CB15',
  },
  from10KTo100K: {
    label: '$10K-$100K',
    color: 'var(--chart-plum)',
  },
  over100K: {
    label: 'Over $100K',
    color: '#F55D3E',
  },
} as const
