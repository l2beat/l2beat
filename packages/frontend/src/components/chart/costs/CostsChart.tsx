import type { Milestone } from '@l2beat/config'
import {
  assert,
  formatBytes,
  formatCurrency,
  formatNumber,
  UnixTime,
} from '@l2beat/shared-pure'
import isNumber from 'lodash/isNumber'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  ChartTooltipWrapper,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatCostValue } from '~/pages/layer2s/costs/utils/formatCostValue'
import type { CostsUnit } from '~/server/features/layer2s/costs/types'
import { formatRange } from '~/utils/dates'
import {
  type ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'

const DATA_POSTED_KEY = 'ethereum' as const
/** Stack order, bottom first. */
const COST_KEYS_BOTTOM_UP = [
  'overhead',
  'compute',
  'blobs',
  'calldata',
] as const
type SeriesKey = (typeof COST_KEYS_BOTTOM_UP)[number] | typeof DATA_POSTED_KEY

interface CostsChartDataPoint {
  timestamp: number
  calldata: number | null
  blobs: number | null
  compute: number | null
  overhead: number | null
  ethereum?: number | null
}

interface Props {
  data: CostsChartDataPoint[] | undefined
  syncedUntil: number | undefined
  unit: CostsUnit
  isLoading: boolean
  milestones: Milestone[]
  range: ChartRange
  hasBlobs: boolean
  project?: ChartProject
  tickCount?: number
}

export function CostsChart({
  project,
  data,
  syncedUntil,
  unit,
  isLoading,
  milestones,
  range,
  tickCount,
  hasBlobs,
}: Props) {
  const chartMeta = useMemo(() => {
    const hasEthereumData = data?.some((d) => isNumber(d.ethereum))
    return {
      calldata: {
        label: 'Calldata',
        color: 'var(--chart-stacked-blue)',
        indicatorType: { shape: 'square' },
      },
      ...(hasBlobs
        ? {
            blobs: {
              label: 'Blobs',
              color: 'var(--chart-stacked-yellow)',
              indicatorType: { shape: 'square' },
            },
          }
        : {}),
      compute: {
        label: 'Compute',
        color: 'var(--chart-stacked-pink)',
        indicatorType: { shape: 'square' },
      },
      overhead: {
        label: 'Overhead',
        color: 'var(--chart-stacked-purple)',
        indicatorType: { shape: 'square' },
      },
      ...(hasEthereumData
        ? {
            ethereum: {
              label: 'Data posted on Ethereum',
              color: 'var(--chart-ethereum)',
              indicatorType: { shape: 'line' as const },
            },
          }
        : {}),
    }
  }, [hasBlobs, data]) satisfies ChartMeta

  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta, [
    DATA_POSTED_KEY,
  ])

  const resolution = rangeToResolution(range)

  const topCostKey = COST_KEYS_BOTTOM_UP.findLast(
    (key) => dataKeys.includes(key) && chartMeta[key],
  )
  const series: ChartSeries<SeriesKey, CostsChartDataPoint>[] = [
    ...COST_KEYS_BOTTOM_UP.filter((key) => chartMeta[key]).map((key) => ({
      key,
      fill: chartMeta[key]?.color,
      stack: true,
      // One dot, on top of the stack.
      activeDot: key === topCostKey,
      hidden: !dataKeys.includes(key),
    })),
    ...(chartMeta.ethereum
      ? [
          {
            key: DATA_POSTED_KEY,
            stroke: chartMeta.ethereum.color,
            axis: 'right' as const,
            hidden: !dataKeys.includes(DATA_POSTED_KEY),
          },
        ]
      : []),
  ]

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      project={project}
      legend
    >
      <TimeSeriesChart
        data={data}
        series={series}
        ariaLabel="Costs"
        syncedUntil={syncedUntil}
        yAxis={{
          format: (value) =>
            unit === 'gas' ? formatNumber(value) : formatCurrency(value, unit),
          tickCount,
        }}
        rightAxis={
          chartMeta.ethereum ? { format: formatBytes, tickCount } : undefined
        }
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            keys={keys}
            unit={unit}
            resolution={resolution}
            chartMeta={chartMeta}
          />
        )}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  keys,
  unit,
  resolution,
  chartMeta,
}: {
  row: CostsChartDataPoint
  keys: SeriesKey[]
  unit: CostsUnit
  resolution: ChartResolution
  chartMeta: ChartMeta
}) {
  const label = row.timestamp
  // Top of the stack first; rows without a value are left out.
  const actualPayload = [...keys].reverse().flatMap((name) => {
    const value = row[name]
    return value !== null && value !== undefined ? [{ name, value }] : []
  })
  const costPayload = actualPayload.filter((p) => !isDataPostedKey(p.name))
  const total = costPayload.reduce<number | null>(
    (acc, curr) => (acc ?? 0) + curr.value,
    null,
  )
  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-44 flex-col">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatRange(label, label + UnixTime.periodToSeconds(resolution))}
        </div>
        {costPayload.length > 1 && (
          <>
            <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
              <span>Total</span>
              <span className="whitespace-nowrap text-primary tabular-nums">
                {total !== null
                  ? formatCostValue(total, unit, 'total')
                  : 'No data'}
              </span>
            </div>
            <HorizontalSeparator className="mt-1.5" />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {actualPayload.map((entry) => {
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            assert(config, 'No config')
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-2"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {isDataPostedKey(entry.name)
                    ? formatBytes(entry.value)
                    : formatCostValue(entry.value, unit, 'total')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function isDataPostedKey(name: string | undefined) {
  return name === DATA_POSTED_KEY
}
