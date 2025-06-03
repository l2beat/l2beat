import type { ChartMeta } from '~/components/core/chart/Chart'

export function getDaChartMeta({
  shape,
}: {
  shape: 'line' | './Square'
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
      color: 'hsl(var(--chart-emerald))',
      indicatorType: { shape },
    },
  } satisfies ChartMeta
}
