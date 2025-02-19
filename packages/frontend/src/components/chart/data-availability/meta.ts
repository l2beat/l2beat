import type { ChartMeta } from '~/components/core/chart/chart'

export type DaChartMeta = typeof daChartMeta
export const daChartMeta = {
  ethereum: {
    label: 'Ethereum (blobs)',
    color: 'hsl(var(--chart-ethereum))',
    indicatorType: { shape: 'square' },
  },
  celestia: {
    label: 'Celestia (fake)',
    color: 'hsl(var(--chart-da-celestia))',
    indicatorType: { shape: 'square' },
  },
  avail: {
    label: 'Avail (fake)',
    color: 'hsl(var(--chart-da-avail))',
    indicatorType: { shape: 'square' },
  },
} as const satisfies ChartMeta
