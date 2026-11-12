import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import compact from 'lodash/compact'
import { useMemo } from 'react'
import { L2_CATEGORY_COLORS } from '~/components/chart/l2CategoryColors'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
  sumEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { trimZeroDecimals } from '~/components/core/chart/utils/yAxisTicks'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { L2SummaryChartHeader } from '~/pages/layer2s/summary/components/L2SummaryChartHeader'
import { useTRPC } from '~/trpc/React'
import { formatSnapshotTimestamp } from '~/utils/dates'
import {
  type ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import type { ChartUnit } from '../types'

const chartMeta = {
  rollups: {
    label: 'Rollups',
    color: L2_CATEGORY_COLORS.rollups,
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: L2_CATEGORY_COLORS.validiumsAndOptimiums,
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: L2_CATEGORY_COLORS.others,
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

export function L2SummaryTvsChart({
  unit,
  range,
  period,
}: {
  unit: ChartUnit
  range: ChartRange
  /** The range as written after the change, e.g. "1y". */
  period: string
}) {
  const trpc = useTRPC()
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  const { data, isLoading } = useQuery(
    trpc.tvs.recategorisedChart.queryOptions({
      range,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens: true,
      filter: { type: 'layer2' },
    }),
  )

  const chartData = useMemo(() => toChartData(data), [data])
  const stats = getStats(chartData, dataKeys)

  return (
    <div className="flex flex-col gap-4">
      <L2SummaryChartHeader
        title="Value secured"
        link={{ href: '/layer2s/tvs', label: 'Details' }}
        value={
          stats?.total !== undefined
            ? formatCurrency(stats.total, unit)
            : undefined
        }
        change={stats?.change}
        period={period}
      />
      <ChartContainer
        isPlaceholderData={false}
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        legend
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
          disableOnboarding: true,
        }}
      >
        <TimeSeriesChart
          data={chartData}
          ariaLabel="Value secured"
          series={[
            {
              key: 'rollups',
              ...tinted(chartMeta.rollups.color),
            },
            {
              key: 'validiumsAndOptimiums',
              ...tinted(chartMeta.validiumsAndOptimiums.color),
            },
            {
              key: 'others',
              ...tinted(chartMeta.others.color),
            },
          ]}
          yAxis={{
            domain: 'autoIfSingle',
            format: (value: number) =>
              trimZeroDecimals(formatCurrency(value, unit)),
          }}
          yLabelHalo
          syncedUntil={data?.syncedUntil}
          renderTooltip={(row, keys) => (
            <CustomTooltip
              row={row}
              visibleKeys={keys}
              resolution={rangeToResolution(range)}
            />
          )}
        />
      </ChartContainer>
    </div>
  )
}

type ChartRow = NonNullable<ReturnType<typeof toChartData>>[number]

function CustomTooltip({
  row,
  visibleKeys,
  resolution,
}: {
  row: ChartRow
  visibleKeys: (keyof typeof chartMeta)[]
  resolution: ChartResolution
}) {
  const label = row.timestamp
  const payload = getTooltipEntries(row, visibleKeys)
  const total = sumEntries(payload)
  return (
    <ChartTooltipWrapper>
      <div className="flex w-[180px]! flex-col [@media(min-width:600px)]:w-64!">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatSnapshotTimestamp(label, resolution)}
        </div>
        {payload.length > 1 && (
          <>
            <div className="mt-3 mb-1.5 flex w-full items-center justify-between gap-2 text-heading-16">
              <span className="[@media(min-width:600px)]:hidden">Total</span>
              <span className="hidden [@media(min-width:600px)]:inline">
                Total value secured
              </span>
              <span className="text-primary">
                {total !== null ? formatCurrency(total, 'usd') : 'No data'}
              </span>
            </div>
            <HorizontalSeparator />
          </>
        )}
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name} gap="gap-x-1">
              <ChartTooltipValue
                value={entry.value}
                format={(value) => formatCurrency(value, 'usd')}
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function toChartData(
  data:
    | { chart: [number, number | null, number | null, number | null][] }
    | undefined,
) {
  return data?.chart.map(
    ([timestamp, rollups, validiumsAndOptimiums, others]) => ({
      timestamp,
      rollups,
      validiumsAndOptimiums,
      others,
    }),
  )
}

function getStats(
  data:
    | {
        timestamp: number
        rollups: number | null
        validiumsAndOptimiums: number | null
        others: number | null
      }[]
    | undefined,
  dataKeys: (keyof typeof chartMeta)[],
) {
  if (!data) {
    return undefined
  }
  const pointsWithData = data.filter(
    (point) =>
      point.rollups !== null ||
      point.validiumsAndOptimiums !== null ||
      point.others !== null,
  )

  const oldestDataPoint = pointsWithData.at(0)
  const newestDataPoint = pointsWithData.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const toSum = compact([
    dataKeys.includes('rollups')
      ? {
          oldest: oldestDataPoint.rollups,
          newest: newestDataPoint.rollups,
        }
      : undefined,
    dataKeys.includes('validiumsAndOptimiums')
      ? {
          oldest: oldestDataPoint.validiumsAndOptimiums,
          newest: newestDataPoint.validiumsAndOptimiums,
        }
      : undefined,
    dataKeys.includes('others')
      ? {
          oldest: oldestDataPoint.others,
          newest: newestDataPoint.others,
        }
      : undefined,
  ])

  const oldestTotal = toSum.reduce((acc, curr) => acc + (curr.oldest ?? 0), 0)
  const newestTotal = toSum.reduce((acc, curr) => acc + (curr.newest ?? 0), 0)
  const change = newestTotal / oldestTotal - 1

  return {
    total: newestTotal,
    change,
  }
}
