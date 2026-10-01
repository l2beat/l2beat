import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { AreaChart } from 'recharts'
import { tvsRangeToReadable } from '~/components/chart/tvs/tvsRangeToReadable'
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
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { ChartStrokeOverFillAreaComponents } from '~/components/core/chart/utils/getStrokeOverFillAreaComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PercentChange } from '~/components/PercentChange'
import { InfoIcon } from '~/icons/Info'
import type { DaTvsProjectIds } from '~/server/features/data-availability/summary/getDaTvsProjectIds'
import { useTRPC } from '~/trpc/React'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { type ChartRange, optionToRange } from '~/utils/range/range'
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

export function DaSummaryTvsChart({
  projectIds,
  slashable,
}: {
  projectIds: DaTvsProjectIds
  /** Ethereum's slashable stake, shown next to the total for scale */
  slashable: number | undefined
}) {
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
  const stats = getStats(chartData, dataKeys)

  return (
    <div className="flex flex-col gap-4 lg:contents">
      <Header
        total={stats?.total}
        change={stats?.change}
        range={range}
        slashable={slashable}
      />
      <ChartContainer
        meta={chartMeta}
        data={chartData}
        isLoading={isLoading}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
          disableOnboarding: true,
        }}
      >
        <AreaChart
          responsive
          data={chartData}
          // Without right:1 the chart last point is not hoverable for some reason
          margin={{ top: 20, right: 1, left: 0, bottom: 0 }}
        >
          <defs>
            <EthereumFillGradientDef id="full-data-fill" />
            <EthereumStrokeGradientDef id="full-data-stroke" />
            <YellowFillGradientDef id="settlement-only-fill" />
            <YellowStrokeGradientDef id="settlement-only-stroke" />
          </defs>
          <ChartLegend content={<ChartLegendContent />} />
          <ChartStrokeOverFillAreaComponents
            data={[
              {
                dataKey: 'fullData',
                stroke: 'url(#full-data-stroke)',
                fill: 'url(#full-data-fill)',
                hide: !dataKeys.includes('fullData'),
              },
              {
                dataKey: 'settlementOnly',
                stroke: 'url(#settlement-only-stroke)',
                fill: 'url(#settlement-only-fill)',
                hide: !dataKeys.includes('settlementOnly'),
              },
            ]}
          />
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={{
              domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
              tickFormatter: (value: number) => formatCurrency(value, 'usd'),
            }}
            syncedUntil={fullData.data?.syncedUntil}
          />
          <ChartTooltip content={<CustomTooltip />} filterNull={false} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({ payload, label }: CustomChartTooltipProps) {
  if (!payload || typeof label !== 'number') return null

  const validPayload = payload.filter((p) => p.type !== 'none' && !p.hide)
  const total = validPayload.reduce<number | null>((acc, curr) => {
    if (curr.value === null || curr.value === undefined) return acc
    return (acc ?? 0) + curr.value
  }, null)
  const isFullDay = UnixTime.isFull(UnixTime(label), 'day')

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[180px]! flex-col [@media(min-width:600px)]:w-60!">
        <div className="font-medium text-label-value-14 text-secondary">
          {isFullDay
            ? formatTimestamp(label, { longMonthName: true })
            : formatTimestamp(label, {
                longMonthName: true,
                mode: 'datetime',
              })}
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
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="font-medium text-label-value-14">
                    {config.label}
                  </span>
                </span>
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null && entry.value !== undefined
                    ? formatCurrency(entry.value, 'usd')
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

function Header({
  total,
  change,
  range,
  slashable,
}: {
  total: number | undefined
  change: number | undefined
  range: ChartRange
  slashable: number | undefined
}) {
  return (
    <div className="flex items-start justify-between">
      <span className="font-bold text-xl">L2s Value Secured</span>
      <div className="flex flex-col items-end">
        {total === undefined || change === undefined ? (
          <Skeleton className="my-[5px] h-5 w-40" />
        ) : (
          <div className="flex items-baseline gap-1.5 whitespace-nowrap">
            <span className="font-bold text-xl">
              {formatCurrency(total, 'usd')}
            </span>
            <span className="text-xs">
              <PercentChange value={change} />
              <span className="text-secondary">
                {' '}
                / {tvsRangeToReadable(range)}
              </span>
            </span>
          </div>
        )}
        {/* The second line, level with the one under the data posted next
            to it */}
        {slashable !== undefined && (
          <Tooltip>
            <TooltipTrigger className="flex items-center gap-1 whitespace-nowrap text-secondary text-xs">
              <span>
                <span className="font-medium text-primary">
                  {formatCurrency(slashable, 'usd')}
                </span>{' '}
                slashable
              </span>
              <InfoIcon className="size-3 fill-current" />
            </TooltipTrigger>
            <TooltipContent>
              The assets that are slashable in case of a data withholding
              attack. For public blockchains, it is equal to 2/3 of the total
              validating stake.
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}

function getStats(
  data: TvsSeriesPoint[] | undefined,
  dataKeys: (keyof typeof chartMeta)[],
) {
  const withData = data?.filter(
    (p) => p.fullData !== null || p.settlementOnly !== null,
  )
  const oldest = withData?.at(0)
  const newest = withData?.at(-1)
  if (!oldest || !newest) return undefined

  const sum = (point: TvsSeriesPoint) =>
    dataKeys.reduce((acc, key) => acc + (point[key] ?? 0), 0)

  return {
    total: sum(newest),
    change: calculatePercentageChange(sum(newest), sum(oldest)),
  }
}
