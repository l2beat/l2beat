import { useMemo } from 'react'
import { assetCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/AssetCategoryTvsChart'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { DonutChart } from '~/components/core/chart/DonutChart'
import { PieChartTooltip } from '~/components/core/chart/PieChartTooltip'
import { useEcosystemDisplayControlsContext } from '~/components/table/display/contexts/EcosystemDisplayControlsContext'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import type { TvsByTokenType } from '~/server/features/ecosystems/getTvsByTokenType'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { EcosystemWidget, EcosystemWidgetTitle } from './EcosystemWidget'

const chartMeta = assetCategoryTvsChartMeta satisfies ChartMeta
const tokenTypeOrder: (keyof TvsByTokenType)[] = [
  'ether',
  'stablecoin',
  'btc',
  'other',
  'rwaPublic',
  'rwaRestricted',
]

export function EcosystemTvsByTokenType({
  tvsByTokenTypeData: { withRwaRestricted, withoutRwaRestricted },
  className,
}: {
  tvsByTokenTypeData: EcosystemEntry['tvsByTokenType']
  className?: string
}) {
  const breakpoint = useBreakpoint()
  const {
    display: { excludeRwaRestrictedTokens },
  } = useEcosystemDisplayControlsContext()
  const tvsByTokenType = excludeRwaRestrictedTokens
    ? withoutRwaRestricted
    : withRwaRestricted

  const chartData = useMemo(() => {
    return tokenTypeOrder
      .map((tokenType) => ({
        tokenType,
        tvs: tvsByTokenType[tokenType],
        fill: chartMeta[tokenType].color,
      }))
      .filter((data) => data.tvs > 0)
  }, [tvsByTokenType])

  const pieData = useMemo(
    () =>
      chartData.map((data) => ({
        name: data.tokenType,
        value: data.tvs,
        fill: data.fill,
      })),
    [chartData],
  )

  const totalTvs = chartData.reduce((acc, curr) => acc + curr.tvs, 0)

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
                        {chartMeta[data.tokenType].label}
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
        <DonutChart
          meta={chartMeta}
          data={pieData}
          className="aspect-square h-[116px] xs:h-[140px] min-h-[116px] xs:min-h-[140px]"
          innerRadius={breakpoint === 'xs' ? 24 : 35}
          outerRadius={breakpoint === 'xs' ? 58 : 70}
          tooltipPosition={breakpoint === 'xs' ? { x: -44, y: -46 } : undefined}
          renderTooltip={(entry) => <PieChartTooltip entry={entry} />}
          center={
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
          }
        />
      </div>
    </EcosystemWidget>
  )
}
