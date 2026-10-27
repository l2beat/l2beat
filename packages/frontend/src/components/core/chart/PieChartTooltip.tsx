import { assert, formatCurrency } from '@l2beat/shared-pure'
import type { CustomChartTooltipProps } from '~/components/core/chart/Chart'
import { ChartTooltipWrapper, useChart } from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { cn } from '~/utils/cn'

export function PieChartTooltip({
  payload,
  className,
}: CustomChartTooltipProps & { className?: string }) {
  const { meta } = useChart()
  if (!payload) return null
  return (
    <ChartTooltipWrapper>
      <div className={cn('flex flex-col gap-1', className)}>
        {payload.map((entry) => {
          if (
            entry.name === undefined ||
            entry.value === undefined ||
            entry.value === null
          )
            return null
          const config = meta[entry.name]
          assert(config, 'No config')

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-3"
            >
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
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
