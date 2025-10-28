import type { Milestone } from '@l2beat/config'
import { assert, UnixTime } from '@l2beat/shared-pure'
import pick from 'lodash/pick'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import type { ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { FuchsiaFillGradientDef } from '~/components/core/chart/defs/FuchsiaGradientDef'
import { LimeFillGradientDef } from '~/components/core/chart/defs/LimeGradientDef'
import { NoDataPatternDef } from '~/components/core/chart/defs/NoDataPatternDef'
import { SkyFillGradientDef } from '~/components/core/chart/defs/SkyGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import type { DaThroughputResolution } from '~/server/features/data-availability/throughput/utils/range'
import { formatRange } from '~/utils/dates'
import { formatBytes } from '~/utils/number-format/formatBytes'

const chartMeta = {
  ethereum: {
    label: 'Data posted on Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: { shape: 'line' as const },
  },
  celestia: {
    label: 'Data posted on Celestia',
    color: 'var(--chart-fuchsia)',
    indicatorType: { shape: 'line' as const },
  },
  avail: {
    label: 'Data posted on Avail',
    color: 'var(--chart-sky)',
    indicatorType: { shape: 'line' as const },
  },
  eigenda: {
    label: 'Data posted on EigenDA',
    color: 'var(--chart-lime)',
    indicatorType: { shape: 'line' as const },
  },
}

interface DataPostedChartDataPoint {
  timestamp: number
  ethereum: number | null
  celestia: number | null
  avail: number | null
  eigenda: number | null
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
  const filteredChartMeta = useMemo(
    () =>
      pick(
        chartMeta,
        Object.keys(chartMeta).filter((key) =>
          data?.some((d) => d[key as keyof DataPostedChartDataPoint] !== null),
        ),
      ),
    [data],
  )
  const { dataKeys, toggleDataKey } = useChartDataKeys(filteredChartMeta)

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={filteredChartMeta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
    >
      <AreaChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        {getStrokeOverFillAreaComponents({
          data: Object.keys(filteredChartMeta).flatMap((key) => ({
            dataKey: key,
            stroke:
              filteredChartMeta[key as keyof typeof filteredChartMeta]?.color,
            fill: `url(#${key}-fill)`,
            hide: !dataKeys.includes(key as keyof typeof filteredChartMeta),
          })),
        })}
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
        />
        <defs>
          <EthereumFillGradientDef id="ethereum-fill" />
          <FuchsiaFillGradientDef id="celestia-fill" />
          <LimeFillGradientDef id="eigenda-fill" />
          <SkyFillGradientDef id="avail-fill" />
          <NoDataPatternDef />
        </defs>
      </AreaChart>
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
      <div className="flex w-50 flex-col sm:w-60">
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
