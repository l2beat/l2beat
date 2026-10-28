import type { Stage } from '@l2beat/config'
import { StageBadge } from '~/components/badge/StageBadge'
import { CssVariables } from '~/components/CssVariables'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { DonutChart } from '~/components/core/chart/DonutChart'
import { PieChartTooltip } from '~/components/core/chart/PieChartTooltip'
import { useEcosystemDisplayControlsContext } from '~/components/table/display/contexts/EcosystemDisplayControlsContext'
import { useBreakpoint } from '~/hooks/useBreakpoint'
import type { EcosystemEntry } from '~/server/features/ecosystems/getEcosystemEntry'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { EcosystemWidget, EcosystemWidgetTitle } from './EcosystemWidget'

const chartMeta = {
  stage0: {
    label: 'Stage 0',
    color: '#F94A24',
    indicatorType: {
      shape: 'square',
    },
  },
  stage1: {
    label: 'Stage 1',
    color: '#FFC61B',
    indicatorType: {
      shape: 'square',
    },
  },
  stage2: {
    label: 'Stage 2',
    color: '#125D19',
    indicatorType: {
      shape: 'square',
    },
  },
  notApplicable: {
    label: 'N/A',
    color: 'var(--not-applicable)',
    indicatorType: {
      shape: 'square',
    },
  },
} satisfies ChartMeta

export function EcosystemTvsByStage({
  tvsByStageData: { withRwaRestricted, withoutRwaRestricted },
  className,
}: {
  tvsByStageData: EcosystemEntry['tvsByStage']
  className?: string
}) {
  const breakpoint = useBreakpoint()
  const {
    display: { excludeRwaRestrictedTokens },
  } = useEcosystemDisplayControlsContext()

  const tvsByStage = excludeRwaRestrictedTokens
    ? withoutRwaRestricted
    : withRwaRestricted

  const chartData = [
    {
      name: 'stage0',
      value: tvsByStage['Stage 0'].tvs,
      fill: '#F94A24',
    },
    {
      name: 'stage1',
      value: tvsByStage['Stage 1'].tvs,
      fill: '#FFC61B',
    },
    {
      name: 'stage2',
      value: tvsByStage['Stage 2'].tvs,
      fill: '#125D19',
    },
    {
      name: 'notApplicable',
      value: tvsByStage.NotApplicable.tvs,
      fill: 'var(--not-applicable)',
    },
  ]
  const totalProjects = Object.values(tvsByStage).reduce(
    (acc, data) => acc + data.projectCount,
    0,
  )

  const totalTvs = Object.values(tvsByStage).reduce(
    (acc, data) => acc + data.tvs,
    0,
  )

  return (
    <EcosystemWidget className={className}>
      <CssVariables
        variables={{
          'not-applicable': {
            light: '#B4C7D5',
            dark: '#3D4361',
          },
        }}
      />
      <EcosystemWidgetTitle className="mb-0 xs:hidden">
        TVS by stage
      </EcosystemWidgetTitle>
      <EcosystemWidgetTitle className="mb-0 max-xs:hidden">
        TVS breakdown by stage
      </EcosystemWidgetTitle>
      <p className="mb-6 font-medium text-label-value-13 text-secondary italic">
        Total {totalProjects} projects
      </p>
      <div className="flex items-center justify-around">
        <div>
          {Object.entries(tvsByStage).map(([stage, data]) => {
            if (stage === 'NotApplicable' && data.tvs === 0) return null
            return (
              <div key={stage} className="flex items-center gap-2">
                <StageBadge stage={stage as Stage} isAppchain={false} />
                <div>
                  <span className="font-medium text-label-value-14 text-secondary">
                    {formatPercent(data.tvs / totalTvs)}
                  </span>{' '}
                  <span className="font-medium text-[#9399A9] text-label-value-14">
                    ({data.projectCount})
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <DonutChart
          meta={chartMeta}
          data={chartData}
          className="aspect-square h-[116px] xs:h-[140px] min-h-[116px] xs:min-h-[140px]"
          innerRadius={breakpoint === 'xs' ? 24 : 35}
          outerRadius={breakpoint === 'xs' ? 58 : 70}
          tooltipPosition={breakpoint === 'xs' ? { x: -22, y: -46 } : undefined}
          renderTooltip={(entry) => (
            <PieChartTooltip entry={entry} className="w-32" />
          )}
          center={
            <text x="50%" y="50%" textAnchor="middle">
              <tspan
                x="50%"
                y="50%"
                className="fill-secondary font-medium text-2xs leading-none"
                dy={5}
              >
                Stages
              </tspan>
            </text>
          }
        />
      </div>
    </EcosystemWidget>
  )
}
