import type { Milestone } from '@l2beat/config'
import { formatBytes, UnixTime } from '@l2beat/shared-pure'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { formatRange } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'

const chartMeta = {
  ethereum: {
    label: 'Ethereum',
    color: 'var(--chart-ethereum)',
    indicatorType: { shape: 'line' },
  },
} satisfies ChartMeta

/** The legend and the series are left out while no value is posted. */
const EMPTY_META: ChartMeta = {}

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
  const hasData = data?.some((d) => d.ethereum !== null) ?? false
  const filteredChartMeta = hasData ? chartMeta : EMPTY_META
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
        series={
          hasData
            ? [
                {
                  key: 'ethereum',
                  stroke: chartMeta.ethereum.color,
                  fill: CHART_GRADIENTS.ethereum.fill,
                },
              ]
            : []
        }
        yAxis={{ tickCount, format: formatBytes }}
        syncedUntil={syncedUntil}
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
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={entry.value}
                format={formatBytes}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
