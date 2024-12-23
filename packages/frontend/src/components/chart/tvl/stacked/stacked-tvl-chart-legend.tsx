import { type ClassNameValue } from 'tailwind-merge'
import { ChartLegend } from '../../core/chart-legend'

export function StackedTvlChartLegend({
  className,
}: { className?: ClassNameValue }) {
  return (
    <ChartLegend
      className={className}
      elements={[
        {
          name: 'Canonical',
          color: 'bg-purple-100 dark:bg-purple-100',
        },
        {
          name: 'External',
          color: 'bg-yellow-200 dark:bg-yellow-200',
        },
        {
          name: 'Native',
          color: 'bg-pink-100 dark:bg-pink-100',
        },
      ]}
    />
  )
}
