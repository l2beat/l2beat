'use client'
import type { TooltipProps } from 'recharts'
import { Label, Pie, PieChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import type { TvsByTokenType } from '~/server/features/ecosystems/get-tvs-by-token-type'
import { formatPercent } from '~/utils/calculate-percentage-change'
import { formatCurrency } from '~/utils/number-format/format-currency'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

const chartMeta = {
  ether: {
    label: 'ETH & LSTs',
    color: 'var(--ecosystem-primary)',
    indicatorType: {
      shape: 'square',
    },
  },
  stablecoins: {
    label: 'Stablecoins',
    color: 'var(--ecosystem-primary-50)',
    indicatorType: {
      shape: 'square',
    },
  },
  other: {
    label: 'Other',
    color: 'var(--ecosystem-primary-25)',
    indicatorType: {
      shape: 'square',
    },
  },
} satisfies ChartMeta

const tokenTypeLabels: Record<keyof TvsByTokenType, string> = {
  ether: 'ETH & LSTs',
  stablecoins: 'Stablecoins',
  other: 'Other',
}

export function EcosystemTvsByTokenType({
  tvsByTokenType,
  className,
}: {
  tvsByTokenType: TvsByTokenType
  className?: string
}) {
  const chartData = [
    {
      tokenType: 'ether' as const,
      tvs: tvsByTokenType.ether,
      fill: 'var(--ecosystem-primary)',
    },
    {
      tokenType: 'stablecoins' as const,
      tvs: tvsByTokenType.stablecoins,
      fill: 'var(--ecosystem-primary-50)',
    },
    {
      tokenType: 'other' as const,
      tvs: tvsByTokenType.other,
      fill: 'var(--ecosystem-primary-25)',
    },
  ]

  const totalTvs =
    tvsByTokenType.ether + tvsByTokenType.stablecoins + tvsByTokenType.other

  return (
    <EcosystemWidget className={className}>
      <EcosystemWidgetTitle className="xs:hidden">
        TVS by token type
      </EcosystemWidgetTitle>
      <EcosystemWidgetTitle className="max-xs:hidden">
        TVS breakdown by token type
      </EcosystemWidgetTitle>

      <div className="flex items-center justify-around">
        <table>
          <tbody>
            {chartData.map((data) => {
              return (
                <tr key={data.tokenType}>
                  <td className="pr-2">
                    <div className="flex items-center gap-2">
                      <ChartDataIndicator
                        backgroundColor={data.fill}
                        type={{ shape: 'square' }}
                      />
                      <div className="text-xs font-medium">
                        {tokenTypeLabels[data.tokenType]}
                      </div>
                    </div>
                  </td>
                  <td className="text-xs font-medium text-secondary">
                    {formatPercent(data.tvs / totalTvs)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <SimpleChartContainer
          meta={chartMeta}
          className="aspect-square h-[116px] min-h-[116px] xs:h-[140px] xs:min-h-[140px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<CustomTooltip />} />
            <Pie
              data={chartData}
              className="max-xs:hidden"
              dataKey="tvs"
              nameKey="tokenType"
              isAnimationActive={false}
              innerRadius={35}
              outerRadius={70}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          dy={-3}
                          className="fill-secondary text-2xs font-medium"
                        >
                          Token
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy={12}
                          className="fill-secondary text-2xs font-medium"
                        >
                          types
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
            <Pie
              data={chartData}
              className="xs:hidden"
              dataKey="tvs"
              nameKey="tokenType"
              isAnimationActive={false}
              innerRadius={24}
              outerRadius={58}
              paddingAngle={2}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          dy={-3}
                          className="fill-secondary text-2xs font-medium"
                        >
                          Token
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy={12}
                          className="fill-secondary text-2xs font-medium"
                        >
                          types
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </SimpleChartContainer>
      </div>
    </EcosystemWidget>
  )
}

export function CustomTooltip({
  active,
  payload,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload) return null
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        {payload.map((entry) => {
          if (entry.value === undefined) return null
          const config = meta[entry.name!]!
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
                <span className="w-20 whitespace-nowrap leading-none sm:w-fit">
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
