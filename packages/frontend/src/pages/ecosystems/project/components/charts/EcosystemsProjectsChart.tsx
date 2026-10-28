import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import { type ChartMeta, useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import {
  type ChartSeries,
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { EcosystemMilestone } from '~/server/features/ecosystems/getEcosystemEntry'
import type { EcosystemProjectsCountData } from '~/server/features/ecosystems/getEcosystemProjectsChartData'
import { formatTimestamp } from '~/utils/dates'
import { EcosystemWidget } from '../widgets/EcosystemWidget'
import { EcosystemChartTimeRange } from './EcosystemsChartTimeRange'
import { EcosystemsMarketShare } from './EcosystemsMarketShare'

type ChartDataPoint = EcosystemProjectsCountData['chart'][number]

const SERIES: ChartSeries<'projectCount', ChartDataPoint>[] = [
  {
    key: 'projectCount',
    stroke: 'var(--ecosystem-primary)',
    fill: 'url(#fill)',
    curve: 'stepAfter',
  },
]

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
  const timeRange = getChartTimeRangeFromData(data.chart)
  assert(timeRange, 'No chart range')
  const total = data.chart.at(-1)?.projectCount
  assert(total !== undefined, 'No data')

  return (
    <EcosystemWidget className={className}>
      <Header
        timeRange={timeRange}
        projectCount={total}
        marketShare={data.marketShare}
      />
      <ChartContainer
        meta={chartMeta}
        data={data.chart}
        isLoading={false}
        logoClassName="bottom-[42px]"
        milestones={ecosystemMilestones}
        className="h-[110px]! min-h-[110px]!"
      >
        <TimeSeriesChart
          data={data.chart}
          series={SERIES}
          ariaLabel="Live projects count"
          margin={{ right: 0 }}
          yAxis={{ tickCount: 2 }}
          defs={
            <CustomFillGradientDef
              id="fill"
              colors={{
                primary: 'var(--ecosystem-primary)',
                secondary: 'var(--ecosystem-secondary)',
              }}
            />
          }
          renderTooltip={(row, keys) => <CustomTooltip row={row} keys={keys} />}
        />
      </ChartContainer>
      <HorizontalSeparator className="mb-3 sm:hidden" />
      {id !== 'agglayer' && <Stats stats={data.stats} />}
    </EcosystemWidget>
  )
}

function Header({
  timeRange,
  projectCount,
  marketShare,
}: {
  timeRange: [number, number]
  projectCount: number
  marketShare: number
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">Live projects count</div>
        <EcosystemChartTimeRange timeRange={timeRange} />
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
  row,
  keys,
}: {
  row: ChartDataPoint
  keys: 'projectCount'[]
}) {
  const { meta } = useChart()
  const payload = getTooltipEntries(row, keys, { skipNull: true })
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-28 flex-col gap-1">
        <div>{formatTimestamp(row.timestamp, { mode: 'date' })}</div>
        <div>
          {payload.map((entry) => {
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
