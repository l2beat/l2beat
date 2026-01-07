import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { cn } from '~/utils/cn'
import type { ChartRange } from '~/utils/range/range'

export function TvsChartControls({
  timeRange,
  unit,
  range,
  className,
}: {
  timeRange: [number, number] | undefined
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
      <ProjectChartTimeRange timeRange={timeRange} />
      <div className="flex w-full items-center justify-between gap-1">
        {unit && (
          <TvsChartUnitControls unit={unit.value} setUnit={unit.setValue} />
        )}
        <TvsChartRangeControls range={range.value} setRange={range.setValue} />
      </div>
    </ChartControlsWrapper>
  )
}
