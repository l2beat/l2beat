import { type ClassNameValue } from 'tailwind-merge'
import { ChartLegend } from '../core/chart-legend'

export function CostsChartLegend({
  className,
}: { className?: ClassNameValue }) {
  return (
    <ChartLegend
      className={className}
      elements={[
        {
          name: 'Calldata',
          color: 'bg-sky-550 dark:bg-sky-500',
        },
        {
          name: 'Blobs',
          color: 'bg-orange-400 dark:bg-yellow-100',
        },
        {
          name: 'Compute',
          color: 'bg-pink-100',
        },
        {
          name: 'Overhead',
          color: 'bg-purple-100',
        },
      ]}
    />
  )
}
