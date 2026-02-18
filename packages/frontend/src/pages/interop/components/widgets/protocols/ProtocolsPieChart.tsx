import { assert } from '@l2beat/shared-pure'
import { Label, Pie, PieChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

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

  if (!isClient || (isLoading && containerWidth)) {
    return (
      <div className="flex h-full items-center">
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
    <div className="flex h-full @min-[430px]:w-[calc(100%-240px)] items-center justify-center">
      <SimpleChartContainer
        height={showSmallerChart ? 110 : 164}
        width="100%"
        meta={chartMeta}
        className={cn(
          'aspect-square h-41 min-h-41',
          showSmallerChart && 'h-[110px] min-h-[110px]',
        )}
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            isAnimationActive={false}
            innerRadius={showSmallerChart ? 35 : 54}
            outerRadius={showSmallerChart ? 55 : 82}
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
                        showSmallerChart && 'text-sm',
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

function CustomTooltip({ payload }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload) return null
  return (
    <ChartTooltipWrapper>
      <div className="flex flex-col gap-1">
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
