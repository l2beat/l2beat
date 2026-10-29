import { useMemo } from 'react'
import { assetCategoryTvsChartMeta } from '~/components/chart/tvs/stacked/AssetCategoryTvsChart'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { DonutChart } from '~/components/core/chart/DonutChart'
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

  const chartData = useMemo(
    () =>
      tokenTypeOrder
        .map((tokenType) => ({
          name: tokenType,
          value: tvsByTokenType[tokenType],
        }))
        .filter((entry) => entry.value > 0),
    [tvsByTokenType],
  )

  const totalTvs = chartData.reduce((acc, curr) => acc + curr.value, 0)

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
                <tr key={data.name}>
                  <td className="pr-2">
                    <div className="flex items-center gap-2">
                      <ChartDataIndicator
                        backgroundColor={chartMeta[data.name].color}
                        type={{ shape: 'square' }}
                      />
                      <div className="font-medium text-xs">
                        {chartMeta[data.name].label}
                      </div>
                    </div>
                  </td>
                  <td className="font-medium text-secondary text-xs">
                    {formatPercent(data.value / totalTvs)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <DonutChart
          ariaLabel="TVS breakdown by token type"
          meta={chartMeta}
          data={chartData}
          className="aspect-square h-[116px] xs:h-[140px] min-h-[116px] xs:min-h-[140px]"
          innerRadius={breakpoint === 'xs' ? 24 : 35}
          outerRadius={breakpoint === 'xs' ? 58 : 70}
          tooltipPosition={breakpoint === 'xs' ? { x: -44, y: -46 } : undefined}
          centerLabel={{ lines: ['Token', 'types'] }}
        />
      </div>
    </EcosystemWidget>
  )
}
