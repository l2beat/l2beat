import { UnixTime } from '@l2beat/shared-pure'
import { useId, useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import { getDaDataParams } from '~/components/chart/data-availability/getDaDataParams'
import { ProjectDaThroughputCustomTooltip } from '~/components/chart/data-availability/ProjectDaAbsoluteThroughputChart'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/Chart'
import { CustomFillGradientDef } from '~/components/core/chart/defs/CustomGradientDef'
import { getChartRange } from '~/components/core/chart/utils/getChartRangeFromColumns'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EcosystemChartTimeRange } from '~/pages/ecosystems/project/components/charts/EcosystemsChartTimeRange'
import { rangeToResolution } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import { formatBpsToMbps } from '~/utils/number-format/formatBytes'
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
  const fillId = useId()
  const { data, isLoading } = api.da.projectChart.useQuery({
    range: { type: 'custom', from, to: to + UnixTime.DAY },
    projectId: id,
    includeScalingOnly: false,
  })

  const chartMeta = useMemo(() => {
    return {
      projects: {
        label: 'Data Posted',
        color: `var(--${id}-primary)`,
        indicatorType: {
          shape: 'line',
        },
      },
    } satisfies ChartMeta
  }, [id])

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

  const range = getChartRange(chartData)

  return (
    <PrimaryCard className="rounded-lg! border border-divider">
      <Header
        range={range}
        stats={{
          pastDayPosted,
          dataPosted,
        }}
      />
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        className="h-44! min-h-44!"
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            dataKey="projects"
            fill={`url(#${fillId})`}
            fillOpacity={1}
            stroke={chartMeta.projects?.color}
            strokeWidth={2}
            isAnimationActive={false}
            dot={false}
          />
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              unit: ` ${unit}`,
            },
            syncedUntil: data?.syncedUntil,
          })}
          <ChartTooltip
            filterNull={false}
            content={
              <ProjectDaThroughputCustomTooltip
                unit={unit}
                resolution={rangeToResolution({ type: 'custom', from, to })}
              />
            }
          />
          <defs>
            <CustomFillGradientDef
              id={fillId}
              colors={{
                primary: `var(--${id}-primary)`,
                secondary: `var(--${id}-secondary)`,
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
  stats: { pastDayPosted: number; dataPosted: number }
}) {
  return (
    <div className="mb-3 flex items-start justify-between">
      <div>
        <div className="font-bold text-xl">Throughput</div>
        <div className="font-medium text-secondary text-xs">
          <EcosystemChartTimeRange range={range} />
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
