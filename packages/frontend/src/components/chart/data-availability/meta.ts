import type { ChartMeta } from '~/components/core/chart/Chart'

export function getDaChartMeta({ shape }: { shape: 'line' | 'square' }) {
  return {
    ethereum: {
      label: 'Ethereum (blobs)',
      color: 'var(--chart-ethereum)',
      indicatorType: { shape },
    },
    celestia: {
      label: 'Celestia',
      color: 'var(--chart-fuchsia)',
      indicatorType: { shape },
    },
    avail: {
      label: 'Avail',
      color: 'var(--chart-sky)',
      indicatorType: { shape },
    },
    eigenda: {
      label: 'EigenDA',
      color: 'var(--chart-lime)',
      indicatorType: { shape },
    },
  } satisfies ChartMeta
}
