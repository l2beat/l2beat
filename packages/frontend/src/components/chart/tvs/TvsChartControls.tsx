import { TvsChartTimeRangeControls } from '~/components/chart/tvs/TvsChartTimeRangeControls'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { cn } from '~/utils/cn'

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
    value: TvsChartRange
    setValue: (range: TvsChartRange) => void
  }
  className?: string
}) {
  return (
    <ChartControlsWrapper className={cn('flex-wrap gap-y-0', className)}>
      <ProjectChartTimeRange range={chartRange} />
      <div className="flex items-center gap-1">
        {unit && (
          <TvsChartUnitControls unit={unit.value} setUnit={unit.setValue} />
        )}
        <TvsChartTimeRangeControls
          projectSection
          timeRange={range.value}
          setTimeRange={range.setValue}
        />
      </div>
    </ChartControlsWrapper>
  )
}
