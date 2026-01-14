import { assert } from '@l2beat/shared-pure'
import { Label, Pie, PieChart, type TooltipProps } from 'recharts'
import {
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { Skeleton } from '~/components/core/Skeleton'
import { useWindowSize } from '~/hooks/useWindowSize'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

export function ProtocolsPieChart({
  chartMeta,
  chartData,
  center,
  isLoading,
}: {
  chartMeta: ChartMeta
  chartData: { name: string; value: number; fill: string }[]
  center: {
    label: string
    value: string | number
  }
  isLoading: boolean
}) {
  const { width } = useWindowSize()
  const isEdgeCaseBreakpoint = width && width >= 1440 && width < 1600

  if (isLoading && width) {
    return (
      <div className="flex h-full items-center">
        <Skeleton
          className="rounded-full"
          style={{
            width: (isEdgeCaseBreakpoint ? 55 : 82) * 2,
            height: (isEdgeCaseBreakpoint ? 55 : 82) * 2,
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full items-center">
      <SimpleChartContainer
        height={isEdgeCaseBreakpoint ? 110 : 164}
        width="100%"
        meta={chartMeta}
        className="aspect-square min-h-41 [@media(min-width:1440px)]:h-[110px] [@media(min-width:1440px)]:min-h-[110px] [@media(min-width:1600px)]:min-h-41"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<CustomTooltip />} />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            isAnimationActive={false}
            innerRadius={isEdgeCaseBreakpoint ? 35 : 54}
            outerRadius={isEdgeCaseBreakpoint ? 55 : 82}
          >
            <Label
              content={() => {
                return (
                  <text x="50%" y="50%" textAnchor="middle">
                    <tspan
                      x="50%"
                      y="50%"
                      className="fill-secondary font-medium text-2xs leading-none"
                      dy={-12}
                    >
                      {center.label}
                    </tspan>
                    <tspan
                      x="50%"
                      y="50%"
                      className={cn(
                        'fill-primary font-semibold text-xl leading-none',
                        isEdgeCaseBreakpoint && 'text-sm',
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

function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload) return null
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
