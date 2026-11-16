import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
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
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { DaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import { useTRPC } from '~/trpc/React'
import { formatSnapshotTimestamp } from '~/utils/dates'
import {
  type ChartResolution,
  optionToRange,
  rangeToResolution,
} from '~/utils/range/range'
import { getTvsSeriesStats, type TvsSeriesStats } from './getTvsSeriesStats'
import { mergeTvsSeries, type TvsSeriesPoint } from './mergeTvsSeries'

const chartMeta = {
  fullData: {
    label: 'Full data',
    color: 'var(--chart-ethereum)',
    indicatorType: {
      shape: 'line',
    },
  },
  settlementOnly: {
    label: 'Settlement only',
    color: 'var(--chart-yellow)',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

export function BlobsTvsChart({ projectIds }: { projectIds: DaTvsProjectIds }) {
  const trpc = useTRPC()
  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)
  // Kept for the life of the page, a new range every render would refetch
  const [range] = useState(() => optionToRange('1y'))

  const options = {
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: true,
  }
  const fullData = useQuery(
    trpc.tvs.chart.queryOptions({
      ...options,
      filter: { type: 'projects', projectIds: projectIds.fullData },
    }),
  )
  const settlementOnly = useQuery(
    trpc.tvs.chart.queryOptions({
      ...options,
      filter: { type: 'projects', projectIds: projectIds.settlementOnly },
    }),
  )
  const isLoading = fullData.isLoading || settlementOnly.isLoading

  const chartData = useMemo(
    () =>
      fullData.data && settlementOnly.data
        ? mergeTvsSeries(fullData.data.chart, settlementOnly.data.chart)
        : undefined,
    [fullData.data, settlementOnly.data],
  )
  const stats = getTvsSeriesStats(chartData, dataKeys)
  // the series sync apart, and the chart is only synced as far as both are
  const syncedUntil =
    fullData.data && settlementOnly.data
      ? Math.min(fullData.data.syncedUntil, settlementOnly.data.syncedUntil)
      : undefined

  return (
    <div className="flex flex-col gap-4 lg:contents">
      <Header stats={stats} isLoading={isLoading} />
      <ChartContainer
        isPlaceholderData={false}
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
          disableOnboarding: true,
        }}
        legend
      >
        <TimeSeriesChart
          data={chartData}
          ariaLabel="L2s value secured"
          series={[
            {
              key: 'fullData',
              ...tinted(chartMeta.fullData.color),
            },
            {
              key: 'settlementOnly',
              ...tinted(chartMeta.settlementOnly.color),
            },
          ]}
          yAxis={{
            domain: 'autoIfSingle',
            format: (value) => formatCurrency(value, 'usd'),
          }}
          syncedUntil={syncedUntil}
          renderTooltip={(row, keys) => (
            <CustomTooltip
              row={row}
              keys={keys}
              resolution={rangeToResolution(range)}
            />
          )}
        />
      </ChartContainer>
    </div>
  )
}

type SeriesKey = keyof typeof chartMeta

function CustomTooltip({
  row,
  keys,
  resolution,
}: {
  row: TvsSeriesPoint
  keys: SeriesKey[]
  resolution: ChartResolution
}) {
  const label = row.timestamp
  const validPayload = getTooltipEntries(row, keys)
  const total = sumEntries(validPayload)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[180px]! flex-col [@media(min-width:600px)]:w-60!">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatSnapshotTimestamp(label, resolution)}
        </div>
        {validPayload.length > 1 && (
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
          {validPayload.map((entry) => {
            return (
              <ChartTooltipRow
                key={entry.name}
                name={entry.name}
                gap="gap-x-1"
                wrapLabel={false}
              >
                <ChartTooltipValue
                  value={entry.value}
                  format={(value) => formatCurrency(value, 'usd')}
                />
              </ChartTooltipRow>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function Header({
  stats,
  isLoading,
}: {
  stats: TvsSeriesStats | undefined
  isLoading: boolean
}) {
  return (
    <ChartCardHeader
      title="L2s value secured"
      link={{ href: '/layer2s/tvs', label: 'All projects' }}
      isLoading={isLoading}
      value={stats && formatCurrency(stats.total, 'usd')}
      change={stats?.change}
      rangeLabel="1y"
      meta={
        !isLoading &&
        stats === undefined && <span className="text-secondary">No data</span>
      }
    />
  )
}
