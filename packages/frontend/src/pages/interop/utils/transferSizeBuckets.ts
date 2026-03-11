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
    color: '#503047',
  },
  over100K: {
    label: 'Over $100K',
    color: '#F55D3E',
  },
} as const
