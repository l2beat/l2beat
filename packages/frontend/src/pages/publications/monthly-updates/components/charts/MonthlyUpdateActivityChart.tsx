import {
  assert,
  formatActivityCount,
  formatInteger,
  type ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import { type ChartMeta, useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { fillGradient } from '~/components/core/chart/gradients'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemChartTimeRange } from '~/pages/ecosystems/project/components/charts/EcosystemsChartTimeRange'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { MarketShare } from './MonthlyUpdateMarketShare'

export function MonthlyUpdateActivityChart({
  entries,
  allL2ProjectsUops,
  from,
  to,
}: {
  entries: ProjectId[]
  allL2ProjectsUops: number
  from: UnixTime
  to: UnixTime
}) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.activity.chart.queryOptions({
      range: [from, to],
      filter: {
        type: 'projects',
        projectIds: entries,
      },
    }),
  )

  const chartMeta = useMemo(() => {
    return {
      projects: {
        label: 'UOPS',
        color: 'var(--project-primary)',
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [])

  const chartData = useMemo(
    () =>
      data?.data.map(([timestamp, _, __, projectsUops]) => {
        return {
          timestamp,
          projects: projectsUops !== null ? projectsUops / UnixTime.DAY : null,
        }
      }),
    [data?.data],
  )

  const stats = getStats(chartData, allL2ProjectsUops)
  const timeRange = getChartTimeRangeFromData(chartData, { bucket: 'day' })

  return (
    <PrimaryCard className="rounded-lg! border border-divider">
      <Header timeRange={timeRange} stats={stats} />
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        legend
        className="h-44! min-h-44!"
      >
        <TimeSeriesChart
          data={chartData}
          ariaLabel="Activity"
          margin={{ right: 0 }}
          series={[
            {
              key: 'projects',
              stroke: 'var(--project-primary)',
              fill: fillGradient(
                'var(--project-primary)',
                'var(--project-secondary)',
              ),
            },
          ]}
          yAxis={{
            unit: ' UOPS',
          }}
          syncedUntil={data?.syncedUntil}
          renderTooltip={(row, keys) => <CustomTooltip row={row} keys={keys} />}
        />
      </ChartContainer>
    </PrimaryCard>
  )
}

function Header({
  timeRange,
  stats,
}: {
  timeRange: [number, number] | undefined
  stats: { latestUops: number; marketShare: number } | undefined
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">Activity</div>
        <div className="font-medium text-secondary text-xs">
          <EcosystemChartTimeRange timeRange={timeRange} />
        </div>
      </div>
      <div className="text-right">
        {stats?.latestUops !== undefined ? (
          <div className="font-bold text-xl">
            {formatActivityCount(stats.latestUops)} UOPS
          </div>
        ) : (
          <Skeleton className="my-[5px] ml-auto h-5 w-32" />
        )}
        <MarketShare marketShare={stats?.marketShare} />
      </div>
    </div>
  )
}

function CustomTooltip({
  row,
  keys,
}: {
  row: { timestamp: number; projects: number | null }
  keys: 'projects'[]
}) {
  const { meta } = useChart()
  const label = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + UnixTime.DAY)}
        </div>
        {getTooltipEntries(row, keys).map((entry) => {
          const config = meta[entry.name]
          assert(config, 'No config')

          return (
            <div key={entry.name} className="flex flex-col gap-2">
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    Average UOPS
                  </span>
                </div>
                <ChartTooltipValue
                  value={entry.value}
                  format={formatActivityCount}
                  className="tabular-nums"
                />
              </div>
              <div className="flex w-full items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    Operations count
                  </span>
                </div>
                <ChartTooltipValue
                  value={entry.value}
                  format={(value) => formatInteger(value * UnixTime.DAY)}
                  className="tabular-nums"
                />
              </div>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}

function getStats(
  chartData: { projects: number | null }[] | undefined,
  allL2ProjectsUops: number,
) {
  if (!chartData) {
    return undefined
  }
  const lastWithData = chartData.filter((d) => d.projects !== null).at(-1) as
    | {
        projects: number
      }
    | undefined
  if (!lastWithData) {
    return undefined
  }

  return {
    latestUops: lastWithData.projects,
    marketShare: lastWithData.projects / allL2ProjectsUops,
  }
}
