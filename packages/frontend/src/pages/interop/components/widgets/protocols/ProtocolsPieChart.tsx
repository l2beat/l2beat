import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  DonutChart,
  type DonutChartEntry,
} from '~/components/core/chart/DonutChart'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'

export function ProtocolsPieChart({
  chartMeta,
  chartData,
  center,
  isLoading,
  containerWidth,
  formatValue,
}: {
  chartMeta: ChartMeta
  chartData: DonutChartEntry[]
  center: {
    label: string
    value: string | number
  }
  isLoading: boolean
  containerWidth: number | undefined
  formatValue?: (value: number) => string
}) {
  const isClient = useIsClient()
  const showSmallerChart = containerWidth && containerWidth < 373
  const chartWrapperClassName =
    'flex h-full @min-[430px]:w-[calc(100%-240px)] items-center justify-center'

  if (!isClient || (isLoading && containerWidth)) {
    return (
      <div className={chartWrapperClassName}>
        <Skeleton
          className="rounded-full"
          style={{
            width: (showSmallerChart ? 55 : 82) * 2,
            height: (showSmallerChart ? 55 : 82) * 2,
          }}
        />
      </div>
    )
  }

  return (
    <div className={chartWrapperClassName}>
      <DonutChart
        ariaLabel="Protocols"
        meta={chartMeta}
        data={chartData}
        className={cn(
          'aspect-square h-41 min-h-41',
          showSmallerChart && 'h-[128px] min-h-[128px]',
        )}
        innerRadius={showSmallerChart ? 46 : 60}
        outerRadius={showSmallerChart ? 64 : 82}
        formatValue={formatValue}
        centerLabel={{
          lines: [center.label],
          value: center.value,
          // Long figures like "$230.85M" take the compact size so they
          // stay inside the hole.
          compact: !!showSmallerChart || String(center.value).length > 7,
        }}
      />
    </div>
  )
}
