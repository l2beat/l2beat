import type { Milestone } from '@l2beat/config'
import { assert, formatBytes, UnixTime } from '@l2beat/shared-pure'
import pick from 'lodash/pick'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import {
  type ChartProject,
  useChart,
} from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EthereumFillGradientDef } from '~/components/core/chart/defs/EthereumGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { formatRange } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'

const chartMeta = {
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: { shape: 'line' as const },
  },
}

type SeriesKey = keyof typeof chartMeta

interface DataPostedChartDataPoint {
  timestamp: number
  ethereum: number | null
}

interface Props {
  data: DataPostedChartDataPoint[] | undefined
  project?: ChartProject
  resolution: ChartResolution
  isLoading: boolean
  syncedUntil: number | undefined
  tickCount?: number
  milestones: Milestone[]
}

export function DataPostedChart({
  data,
  project,
  resolution,
  isLoading,
  syncedUntil,
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
      meta={filteredChartMeta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      legend
    >
      <TimeSeriesChart
        data={data}
        ariaLabel="Data posted"
        series={(Object.keys(filteredChartMeta) as SeriesKey[]).map((key) => ({
          key,
          stroke: filteredChartMeta[key]?.color,
          fill: `url(#${key}-fill)`,
          hidden: !dataKeys.includes(key),
        }))}
        yAxis={{ tickCount, format: formatBytes }}
        syncedUntil={syncedUntil}
        defs={<EthereumFillGradientDef id="ethereum-fill" />}
        renderTooltip={(row, keys) => (
          <DataPostedCustomTooltip
            row={row}
            keys={keys}
            resolution={resolution}
          />
        )}
      />
    </ChartContainer>
  )
}

function DataPostedCustomTooltip({
  row,
  keys,
  resolution,
}: {
  row: DataPostedChartDataPoint
  keys: SeriesKey[]
  resolution: ChartResolution
}) {
  const { meta } = useChart()
  const timestamp = row.timestamp
  const payload = getTooltipEntries(row, keys, { skipNull: true })

  return (
    <ChartTooltipWrapper>
      <div className="flex w-50 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(
            timestamp,
            timestamp + UnixTime.periodToSeconds(resolution),
          )}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
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
                  {entry.value !== null ? formatBytes(entry.value) : 'No data'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
