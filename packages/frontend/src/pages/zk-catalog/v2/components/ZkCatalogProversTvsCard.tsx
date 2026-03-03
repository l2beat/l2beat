import { useMemo, useState } from 'react'
import { Area, AreaChart } from 'recharts'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { tvsRangeToReadable } from '~/components/chart/tvs/tvsRangeToReadable'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useFilterEntries } from '~/components/table/filters/UseFilterEntries'
import { INFINITY } from '~/consts/characters'
import type { ZkCatalogEntry } from '~/server/features/zk-catalog/getZkCatalogEntries'
import { api } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ChartRange } from '~/utils/range/range'
import { optionToRange } from '~/utils/range/range'
import {
  getProjectsForTvsQuery,
  getZkCatalogProverChartData,
} from './ZkCatalogProversTvsChartUtils'

export function ZkCatalogProversTvsCard({
  entries,
}: {
  entries: ZkCatalogEntry[]
}) {
  const filterEntries = useFilterEntries()
  const [range, setRange] = useState<ChartRange>(optionToRange('1y'))

  const filteredEntries = useMemo(
    () => entries.filter(filterEntries),
    [entries, filterEntries],
  )

  const provers = useMemo(
    () =>
      filteredEntries
        .filter((entry) => entry.projectsForTvs.length > 0)
        .map((entry) => ({
          proverId: entry.id.toString(),
          projectsForTvs: entry.projectsForTvs,
        })),
    [filteredEntries],
  )

  const proverLabels = useMemo(
    () =>
      Object.fromEntries(
        filteredEntries.map((entry) => [entry.id.toString(), entry.name]),
      ),
    [filteredEntries],
  )

  const projectsForQuery = useMemo(
    () => getProjectsForTvsQuery(provers),
    [provers],
  )

  const { data, isLoading } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForQuery,
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: true,
  })

  const chartData = useMemo(
    () => getZkCatalogProverChartData(data, provers),
    [data, provers],
  )

  const colors = useMemo(
    () => generateAccessibleColors(chartData.visibleProverIds.length),
    [chartData.visibleProverIds.length],
  )

  const chartMeta = useMemo(() => {
    let colorIndex = 0
    return chartData.legendOrderedIds.reduce((acc, proverId) => {
      acc[proverId] = {
        label: proverLabels[proverId] ?? proverId,
        color: colors[colorIndex++] ?? '#999999',
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {} as ChartMeta)
  }, [chartData.legendOrderedIds, proverLabels, colors])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        chartData.chartData.map((point) => ({ timestamp: point.timestamp })),
      ),
    [chartData.chartData],
  )

  return (
    <PrimaryCard className="mt-1 mb-4 max-md:mt-4">
      <Header
        isLoading={isLoading}
        range={range}
        total={chartData.total}
        change={chartData.change}
        timeRange={timeRange}
      />
      <div className="mt-4 mb-3">
        {!isLoading && chartData.visibleProverIds.length === 0 ? (
          <div className="flex h-[188px] min-h-[188px] w-full items-center justify-center font-medium text-secondary md:h-[228px] md:min-h-[228px] 2xl:h-[258px] 2xl:min-h-[258px]">
            No data
          </div>
        ) : (
          <ChartContainer
            data={chartData.chartData}
            meta={chartMeta}
            isLoading={isLoading}
            interactiveLegend={{
              dataKeys,
              onItemClick: toggleDataKey,
            }}
          >
            <AreaChart
              responsive
              data={chartData.chartData}
              margin={{ top: 20 }}
            >
              <ChartLegendToggleAll
                showAllSelected={showAllSelected}
                onToggleAll={toggleAllDataKeys}
              />
              {chartData.chartOrderedIds.map((proverId) => (
                <Area
                  key={proverId}
                  dataKey={proverId}
                  hide={!dataKeys.includes(proverId)}
                  fill={chartMeta[proverId]?.color}
                  fillOpacity={1}
                  strokeWidth={0}
                  stackId={dataKeys.length === 1 ? undefined : 'a'}
                  isAnimationActive={false}
                />
              ))}
              <ChartCommonComponents
                data={chartData.chartData}
                isLoading={isLoading}
                yAxis={{
                  domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
                  tickFormatter: (value: number) =>
                    formatCurrency(value, 'usd'),
                  tickCount: 4,
                }}
                syncedUntil={chartData.syncedUntil}
              />
              <ChartTooltip content={<CustomTooltip />} filterNull={false} />
            </AreaChart>
          </ChartContainer>
        )}
      </div>
      <TvsChartControls
        timeRange={timeRange}
        range={{
          value: range,
          setValue: setRange,
        }}
      />
    </PrimaryCard>
  )
}

function Header({
  total,
  change,
  range,
  timeRange,
  isLoading,
}: {
  total: number | undefined
  change: number | undefined
  range: ChartRange
  timeRange: [number, number] | undefined
  isLoading: boolean
}) {
  const changeOverTime =
    range[0] === null ? (
      INFINITY
    ) : change !== undefined ? (
      <PercentChange value={change} textClassName="lg:w-[63px] lg:text-base" />
    ) : (
      'No data'
    )

  return (
    <header className="flex justify-between text-base">
      <div>
        <h2 className="font-bold text-xl md:text-2xl">
          Total value secured stacked by prover
        </h2>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right font-bold text-xl md:text-2xl">
          {isLoading ? (
            <Skeleton className="my-[5px] h-5 w-32 md:my-1.5 md:h-6" />
          ) : total !== undefined ? (
            formatCurrency(total, 'usd')
          ) : (
            'No data'
          )}
        </div>
        <p className="whitespace-nowrap text-right font-medium text-secondary text-xs lg:text-base">
          {changeOverTime} / {tvsRangeToReadable(range)}
        </p>
      </div>
    </header>
  )
}

function CustomTooltip({ payload, label }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  const actualPayload = [...payload]
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .filter((entry) => !entry.hide && entry.value !== null)

  const total = actualPayload.reduce(
    (sum, entry) => sum + (entry.value ?? 0),
    0,
  )

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
      </div>
      <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
        <span>Total</span>
        <span className="whitespace-nowrap text-primary tabular-nums">
          {formatCurrency(total, 'usd')}
        </span>
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {actualPayload.slice(0, 20).map((entry, index) => {
          if (entry.type === 'none' || !entry.name) return null
          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={index}
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
              <div className="flex items-end justify-end gap-1 max-sm:flex-col sm:items-center">
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== undefined
                    ? formatCurrency(entry.value, 'usd')
                    : 'No data'}
                </span>
                {entry.value !== undefined && total > 0 && (
                  <span className="font-medium text-label-value-13 text-secondary sm:text-label-value-15">
                    ({formatPercent(entry.value / total)})
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
