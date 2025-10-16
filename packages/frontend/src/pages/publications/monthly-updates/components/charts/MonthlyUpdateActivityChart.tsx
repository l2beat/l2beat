import { assert, type ProjectId, UnixTime } from '@l2beat/shared-pure'
import compact from 'lodash/compact'
import { useId, useMemo } from 'react'
import { AreaChart, type TooltipProps } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemChartTimeRange } from '~/pages/ecosystems/project/components/charts/EcosystemsChartTimeRange'
import { api } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { MarketShare } from './MonthlyUpdateMarketShare'

export function MonthlyUpdateActivityChart({
  entries,
  allScalingProjectsUops,
  from,
  to,
}: {
  entries: ProjectId[]
  allScalingProjectsUops: number
  from: UnixTime
  to: UnixTime
}) {
  const id = useId()
  const { data, isLoading } = api.activity.chart.useQuery({
    range: { type: 'custom', from, to },
    filter: {
      type: 'projects',
      projectIds: entries,
    },
  })

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

  const stats = getStats(chartData, allScalingProjectsUops)
  const range = getChartRange(chartData)

  return (
    <PrimaryCard className="rounded-lg! border border-divider">
      <Header range={range} stats={stats} />
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        className="h-44! min-h-44!"
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: compact([
              {
                dataKey: 'projects',
                stroke: 'var(--project-primary)',
                fill: `url(#${id})`,
              },
            ]),
          })}
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              scale: 'lin',
              unit: ' UOPS',
            },
            syncedUntil: data?.syncedUntil,
          })}
          <ChartTooltip filterNull={false} content={<CustomTooltip />} />
          <defs>
            <CustomFillGradientDef
              id={id}
              colors={{
                primary: 'var(--project-primary)',
                secondary: 'var(--project-secondary)',
              }}
            />
          </defs>
        </AreaChart>
      </ChartContainer>
    </PrimaryCard>
  )
}

function Header({
  range,
  stats,
}: {
  range: [number, number] | undefined
  stats: { latestUops: number; marketShare: number } | undefined
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">Activity</div>
        <div className="font-medium text-secondary text-xs">
          <EcosystemChartTimeRange range={range} />
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
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + UnixTime.DAY)}
        </div>
        {payload.map((entry) => {
          if (entry.name === undefined || entry.type === 'none') return null
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
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value !== null && entry.value !== undefined
                    ? formatActivityCount(entry.value)
                    : 'No data'}
                </span>
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
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value !== null && entry.value !== undefined
                    ? formatInteger(entry.value * UnixTime.DAY)
                    : 'No data'}
                </span>
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
  allScalingProjectsUops: number,
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
    marketShare: lastWithData.projects / allScalingProjectsUops,
  }
}
