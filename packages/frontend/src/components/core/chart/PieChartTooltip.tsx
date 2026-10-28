import { assert, formatCurrency } from '@l2beat/shared-pure'
import { useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { cn } from '~/utils/cn'
import { tooltipContentVariants } from '../tooltip/Tooltip'

/** The hovered slice of a `DonutChart`, labelled from the chart meta. */
export function PieChartTooltip({
  entry,
  className,
}: {
  entry: { name: string; value: number }
  className?: string
}) {
  const { meta } = useChart()
  const config = meta[entry.name]
  assert(config, 'No config')

  return (
    <div className={tooltipContentVariants()}>
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="flex items-center justify-between gap-x-3">
          <span className="flex items-center gap-1">
            <ChartDataIndicator
              backgroundColor={config.color}
              type={config.indicatorType}
            />
            <span className="whitespace-nowrap leading-none sm:w-fit">
              {config.label}
            </span>
          </span>
          <span className="whitespace-nowrap font-medium leading-none">
            {formatCurrency(entry.value, 'usd')}
          </span>
        </div>
      </div>
    </div>
  )
}
