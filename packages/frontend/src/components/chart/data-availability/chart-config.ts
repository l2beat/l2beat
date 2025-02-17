import type { ChartConfig } from '~/components/core/chart/chart'

export type DaChartConfig = typeof daChartConfig
export const daChartConfig = {
  ethereum: {
    label: 'Ethereum (blobs)',
    color: 'hsl(var(--chart-ethereum))',
  },
  celestia: {
    label: 'Celestia (fake)',
    color: 'hsl(var(--chart-da-celestia))',
  },
  avail: {
    label: 'Avail (fake)',
    color: 'hsl(var(--chart-da-avail))',
  },
} as const satisfies ChartConfig
