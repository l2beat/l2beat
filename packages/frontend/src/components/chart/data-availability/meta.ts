import type { ChartMeta } from '~/components/core/chart/chart'

export type DaChartMeta = typeof daChartMeta
export const daChartMeta = {
  ethereum: {
    label: 'Ethereum (blobs)',
    color: 'hsl(var(--chart-ethereum))',
  },
  celestia: {
    label: 'Celestia',
    color: 'hsl(var(--chart-da-celestia))',
  },
  avail: {
    label: 'Avail',
    color: 'hsl(var(--chart-da-avail))',
  },
} as const satisfies ChartMeta
