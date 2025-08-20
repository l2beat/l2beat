import type { Milestone } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, ComposedChart } from 'recharts'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EmeraldFillGradientDef } from '~/components/core/chart/defs/EmeraldGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import type { DaThroughputResolution } from '~/server/features/data-availability/throughput/utils/range'
import { formatRange } from '~/utils/dates'
import { formatBytes } from '~/utils/number-format/formatBytes'

interface DataPostedChartDataPoint {
  timestamp: number
  posted: number | null
}

interface Props {
  data: DataPostedChartDataPoint[] | undefined
  project?: ChartProject
  resolution: DaThroughputResolution
  isLoading: boolean
  syncedUntil: number | undefined
  className?: string
  tickCount?: number
  milestones: Milestone[]
}

export function DataPostedChart({
  data,
  project,
  resolution,
  isLoading,
  syncedUntil,
  className,
  tickCount,
  milestones,
}: Props) {
  const chartMeta = {
    posted: {
      label: 'Data posted',
      color: 'var(--chart-emerald)',
      indicatorType: {
        shape: 'line',
      },
    },
  } satisfies ChartMeta

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
    >
      <ComposedChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="posted"
          fill="url(#fillPosted)"
          fillOpacity={1}
          stroke={chartMeta.posted.color}
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tickCount,
            tickFormatter: (value: number) => formatBytes(value),
          },
          syncedUntil,
        })}
        <ChartTooltip
          content={<DataPostedCustomTooltip resolution={resolution} />}
          filterNull={false}
        />
        <defs>
          <EmeraldFillGradientDef id="fillPosted" />
        </defs>
      </ComposedChart>
    </ChartContainer>
  )
}

function DataPostedCustomTooltip({
  active,
  payload,
  label: timestamp,
  resolution,
}: TooltipProps<number, string> & {
  resolution: DaThroughputResolution
}) {
  const { meta } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(
            timestamp,
            timestamp +
              (resolution === 'daily'
                ? UnixTime.DAY
                : resolution === 'sixHourly'
                  ? UnixTime.HOUR * 6
                  : UnixTime.HOUR),
          )}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.name === undefined || entry.type === 'none') return null
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value !== null && entry.value !== undefined
                    ? formatBytes(entry.value)
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
