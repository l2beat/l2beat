import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Label, Pie, PieChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartTooltip,
  ChartTooltipWrapper,
  SimpleChartContainer,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import type { TvsByTokenType } from '~/server/features/ecosystems/getTvsByTokenType'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { EcosystemWidget, EcosystemWidgetTitle } from './EcosystemWidget'

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
  const breakpoint = useBreakpoint()
  const chartData = useMemo(() => {
    return [
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
  }, [tvsByTokenType])

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
                      <div className="font-medium text-xs">
                        {tokenTypeLabels[data.tokenType]}
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-secondary text-xs">
                    {formatPercent(data.tvs / totalTvs)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <SimpleChartContainer
          meta={chartMeta}
          className="aspect-square h-[116px] xs:h-[140px] min-h-[116px] xs:min-h-[140px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<CustomTooltip />}
              position={breakpoint === 'xs' ? { x: -44, y: -46 } : undefined}
            />
            <Pie
              data={chartData}
              dataKey="tvs"
              nameKey="tokenType"
              isAnimationActive={false}
              innerRadius={breakpoint === 'xs' ? 24 : 35}
              outerRadius={breakpoint === 'xs' ? 58 : 70}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x="50%" y="50%" textAnchor="middle">
                        <tspan
                          x="50%"
                          dy={-1}
                          className="fill-secondary font-medium text-2xs leading-none"
                        >
                          Token
                        </tspan>
                        <tspan
                          x="50%"
                          dy={12}
                          className="fill-secondary font-medium text-2xs leading-none"
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
      <div className="flex w-36 flex-col gap-1">
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
