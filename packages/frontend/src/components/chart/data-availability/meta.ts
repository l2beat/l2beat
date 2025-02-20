import type { ChartMeta } from '~/components/core/chart/chart'

export function getDaChartMeta({
  shape,
}: {
  shape: 'line' | 'square'
}) {
  return {
    ethereum: {
      label: 'Ethereum (blobs)',
      color: 'hsl(var(--chart-ethereum))',
      indicatorType: { shape },
    },
    celestia: {
      label: 'Celestia',
      color: 'hsl(var(--chart-da-celestia))',
      indicatorType: { shape },
    },
    avail: {
      label: 'Avail',
      color: 'hsl(var(--chart-da-avail))',
      indicatorType: { shape },
    },
  } satisfies ChartMeta
}
