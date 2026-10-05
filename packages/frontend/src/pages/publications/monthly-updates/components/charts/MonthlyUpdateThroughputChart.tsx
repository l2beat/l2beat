import { formatBpsToMbps, formatBytes, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useId, useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemChartTimeRange } from '~/pages/ecosystems/project/components/charts/EcosystemsChartTimeRange'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { type ChartResolution, rangeToResolution } from '~/utils/range/range'
import { getDaDataParams } from './getDaDataParams'
import { MarketShare } from './MonthlyUpdateMarketShare'

export function MonthlyUpdateThroughputChart({
  id,
  from,
  to,
  pastDayPosted,
  dataPosted,
}: {
  id: string
  from: UnixTime
  to: UnixTime
  pastDayPosted: number
  dataPosted: number
}) {
  const trpc = useTRPC()
  const fillId = useId()
  const { data, isLoading } = useQuery(
    trpc.da.projectChart.queryOptions({
      range: [from, to + UnixTime.DAY],
      projectId: id,
      includeL2Only: false,
    }),
  )

  const chartMeta = useMemo(() => {
    return {
      projects: {
        label: 'Data Posted',
        color: 'var(--project-primary)',
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [])

  const max = useMemo(() => {
    return data
      ? Math.max(...data.chart.map(([_, value]) => value ?? 0))
      : undefined
  }, [data])

  const { denominator, unit } = getDaDataParams(max)

  const chartData = useMemo(() => {
    return data?.chart?.map(([timestamp, value]) => {
      return {
        timestamp,
        projects: value ? value / denominator : null,
      }
    })
  }, [data?.chart, denominator])

  const timeRange = getChartTimeRangeFromData(chartData, {
    bucket: rangeToResolution([from, to]),
  })

  return (
    <PrimaryCard className="rounded-lg! border border-divider">
      <Header
        timeRange={timeRange}
        stats={{
          pastDayPosted,
          dataPosted,
        }}
      />
      <ChartContainer data={chartData} meta={chartMeta} isLoading={isLoading}>
        <AreaChart
          responsive
          data={chartData}
          className="h-44! min-h-44!"
          margin={{ top: 20 }}
        >
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="projects"
            fill={`url(#${fillId})`}
            fillOpacity={1}
            stroke={chartMeta.projects?.color}
            isAnimationActive={false}
            dot={false}
          />
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={{
              unit: ` ${unit}`,
            }}
            syncedUntil={data?.syncedUntil}
          />
          <ChartTooltip
            filterNull={false}
            content={
              <ThroughputTooltip
                denominator={denominator}
                resolution={rangeToResolution([from, to])}
              />
            }
          />
          <defs>
            <CustomFillGradientDef
              id={fillId}
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
  timeRange,
  stats,
}: {
  timeRange: [number, number] | undefined
  stats: { pastDayPosted: number; dataPosted: number }
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">Throughput</div>
        <div className="font-medium text-secondary text-xs">
          <EcosystemChartTimeRange timeRange={timeRange} />
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-xl">
          {formatBpsToMbps(stats.pastDayPosted / UnixTime.DAY)}
        </div>
        <MarketShare marketShare={stats.pastDayPosted / stats.dataPosted} />
      </div>
    </div>
  )
}

function ThroughputTooltip({
  payload,
  label,
  denominator,
  resolution,
}: CustomChartTooltipProps & {
  denominator: number
  resolution: ChartResolution
}) {
  const { meta: config } = useChart()
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry || entry.hide) return null

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={configEntry.indicatorType}
                  backgroundColor={configEntry.color}
                />
                <span className="font-medium text-label-value-14">
                  {configEntry.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {formatBytes((entry.value ?? 0) * denominator)}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
