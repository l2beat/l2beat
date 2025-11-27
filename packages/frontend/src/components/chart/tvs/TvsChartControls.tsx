import { TvsChartTimeRangeControls } from '~/components/chart/tvs/TvsChartTimeRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'

export function TvsChartControls({
  chartRange,
  unit,
  range,
  className,
}: {
  chartRange: [number, number] | undefined
  unit?: {
    value: ChartUnit
    setValue: (unit: ChartUnit) => void
  }
  range: {
    value: ChartRange
    setValue: (range: ChartRange) => void
  }
  className?: string
}) {
  return (
    <ChartControlsWrapper className={cn('flex-wrap gap-y-0', className)}>
      <ProjectChartTimeRange range={chartRange} />
      <div className="flex w-full items-center justify-between gap-1">
        {unit && (
          <TvsChartUnitControls unit={unit.value} setUnit={unit.setValue} />
        )}
        <TvsChartTimeRangeControls
          timeRange={range.value}
          setTimeRange={range.setValue}
        />
      </div>
    </ChartControlsWrapper>
  )
}
