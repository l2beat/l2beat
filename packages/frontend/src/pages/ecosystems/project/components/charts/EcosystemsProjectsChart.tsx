import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { EcosystemMilestone } from '~/server/features/ecosystems/getEcosystemEntry'
import type { EcosystemProjectsCountData } from '~/server/features/ecosystems/getEcosystemProjectsChartData'
import { formatTimestamp } from '~/utils/dates'
import { EcosystemWidget } from '../widgets/EcosystemWidget'
import { EcosystemChartTimeRange } from './EcosystemsChartTimeRange'
import { EcosystemsMarketShare } from './EcosystemsMarketShare'

interface Props {
  id: string
  data: EcosystemProjectsCountData
  className?: string
  ecosystemMilestones: EcosystemMilestone[]
}

export function EcosystemsProjectsChart({
  id,
  data,
  className,
  ecosystemMilestones,
}: Props) {
  const chartMeta = useMemo(() => {
    return {
      projectCount: {
        color: 'var(--ecosystem-primary)',
        label: 'Live project count',
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [])
  const range = getChartRange(data.chart)
  assert(range, 'No chart range')
  const total = data.chart.at(-1)?.projectCount
  assert(total !== undefined, 'No data')

  return (
    <EcosystemWidget className={className}>
      <Header
        range={range}
        projectCount={total}
        marketShare={data.marketShare}
      />
      <ChartContainer
        meta={chartMeta}
        data={data.chart}
        className="h-[110px]! min-h-[110px]!"
        logoClassName="bottom-[42px]"
        milestones={ecosystemMilestones}
      >
        <AreaChart data={data.chart} accessibilityLayer margin={{ top: 20 }}>
          <defs>
            <CustomFillGradientDef
              id="fill"
              colors={{
                primary: 'var(--ecosystem-primary)',
                secondary: 'var(--ecosystem-secondary)',
              }}
            />
          </defs>
          <Area
            dataKey="projectCount"
            fill="url(#fill)"
            fillOpacity={1}
            stroke="var(--ecosystem-primary)"
            strokeWidth={2}
            type="stepAfter"
            isAnimationActive={false}
          />
          {getCommonChartComponents({
            data: data.chart,
            isLoading: false,
            yAxis: {
              tickCount: 2,
            },
            syncedUntil: undefined,
          })}
          <ChartTooltip content={<CustomTooltip />} />
        </AreaChart>
      </ChartContainer>
      <HorizontalSeparator className="mb-3 sm:hidden" />
      {id !== 'agglayer' && <Stats stats={data.stats} />}
    </EcosystemWidget>
  )
}

function Header({
  range,
  projectCount,
  marketShare,
}: {
  range: [number, number]
  projectCount: number
  marketShare: number
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">Live projects count</div>
        <EcosystemChartTimeRange range={range} />
      </div>
      <div className="text-right">
        <div className="font-bold text-xl">{projectCount} Projects</div>
        <EcosystemsMarketShare marketShare={marketShare} />
      </div>
    </div>
  )
}

function Stats({ stats }: { stats: EcosystemProjectsCountData['stats'] }) {
  return (
    <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
      <div className="flex items-baseline justify-between rounded border-divider sm:border sm:px-6 sm:py-3 sm:max-xl:flex-col sm:max-xl:items-center sm:max-xl:justify-center">
        <span className="text-balance text-center font-medium text-label-value-14 text-secondary sm:text-label-value-12 sm:max-xl:mb-1">
          Projects with TVS &gt; $100M
        </span>
        <span className="font-bold text-label-value-15">
          {stats.tvsGreaterThanHundredMillion} projects
        </span>
      </div>
      <div className="flex items-baseline justify-between rounded border-divider sm:border sm:px-6 sm:py-3 sm:max-xl:flex-col sm:max-xl:items-center sm:max-xl:justify-center">
        <span className="text-balance text-center font-medium text-label-value-14 text-secondary sm:text-label-value-12 sm:max-xl:mb-1">
          Projects with avg UOPS &gt; 1
        </span>
        <span className="font-bold text-label-value-15">
          {stats.avgUopsGreaterThanOne} projects
        </span>
      </div>
    </div>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        <div>
          {formatTimestamp(label, { longMonthName: true, mode: 'date' })}
        </div>
        <div>
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
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium leading-none">
                  {entry.value}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
