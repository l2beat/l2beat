import { Label, Pie, PieChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartTooltip,
  SimpleChartContainer,
} from '~/components/core/chart/Chart'
import { PieChartTooltip } from '~/components/core/chart/PieChartTooltip'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'

export function ProtocolsPieChart({
  chartMeta,
  chartData,
  center,
  isLoading,
  containerWidth,
}: {
  chartMeta: ChartMeta
  chartData: { name: string; value: number; fill: string }[]
  center: {
    label: string
    value: string | number
  }
  isLoading: boolean
  containerWidth: number | undefined
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
      <SimpleChartContainer meta={chartMeta}>
        <PieChart
          responsive
          height={showSmallerChart ? 128 : 164}
          width="100%"
          className={cn(
            'aspect-square! h-41 min-h-41',
            showSmallerChart && 'h-[128px] min-h-[128px]',
          )}
        >
          <ChartTooltip cursor={false} content={<PieChartTooltip />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            isAnimationActive={false}
            innerRadius={showSmallerChart ? 42 : 54}
            outerRadius={showSmallerChart ? 64 : 82}
          >
            <Label
              content={() => {
                return (
                  <text x="50%" y="50%" textAnchor="middle">
                    <tspan
                      x="50%"
                      y="50%"
                      className="fill-secondary font-medium text-2xs leading-none"
                      dy={showSmallerChart ? -9 : -16}
                    >
                      {center.label}
                    </tspan>
                    <tspan
                      x="50%"
                      y="50%"
                      className={cn(
                        'fill-primary font-semibold text-2xl leading-none',
                        showSmallerChart && 'text-lg',
                      )}
                      dy={9}
                    >
                      {center.value}
                    </tspan>
                  </text>
                )
              }}
            />
          </Pie>
        </PieChart>
      </SimpleChartContainer>
    </div>
  )
}
