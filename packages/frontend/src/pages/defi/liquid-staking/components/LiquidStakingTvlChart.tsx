import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import type { ChartRangeOptionValue } from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { formatStakedEthShare } from '../liquidStakingMetrics'
import type { LiquidStakingChartSeries } from './LiquidStakingLineChart'
import { OTHERS_KEY, type TvlRow, toRow } from './liquidStakingTvlRows'

const OTHERS_COLOR = 'color-mix(in oklab, var(--secondary) 28%, transparent)'
const OTHERS_STROKE = 'var(--secondary)'

const DESCRIPTION = [
  "Each protocol's layer is the ETH its tokens stand for at its own exchange rate. The layers add up to the balance of all active Ethereum validators: Others is the rest, staked solo, through exchanges or through protocols not listed here.",
  "USD values are that ETH at the day's ETH price, so they can differ slightly from the TVL in the table, which prices the tokens themselves.",
  'A protocol also holds ETH not yet staked, or exited but not yet withdrawn, so Others can read slightly low. Days on which a protocol has no data show no Others.',
].join(' ')

interface Props {
  projectSeries: LiquidStakingChartSeries[]
  range: ChartRange
  rangeOptions: readonly { value: ChartRangeOptionValue }[]
}

/**
 * The ETH staked network-wide, split into the liquid staking protocols and
 * everyone else, stacked over time.
 */
export function LiquidStakingTvlChart({
  projectSeries,
  range,
  rangeOptions,
}: Props) {
  const trpc = useTRPC()
  const [unit, setUnit] = useState<ChartUnit>('usd')
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.defi.liquidStakingTvlChart,
    { range },
  )

  const projectKeys = useMemo(
    () => projectSeries.map((series) => series.key),
    [projectSeries],
  )
  const chartData = useMemo(
    () => data?.map((point) => toRow(point, projectKeys, unit)),
    [data, projectKeys, unit],
  )

  // Protocols in the table's order, the biggest at the bottom, and Others
  // on top, so its upper edge traces the total stake.
  const chartMeta = useMemo<ChartMeta>(() => {
    const meta: ChartMeta = {}
    for (const series of projectSeries) {
      meta[series.key] = {
        label: series.label,
        color: series.color,
        indicatorType: { shape: 'square' },
      }
    }
    meta[OTHERS_KEY] = {
      label: 'Others',
      color: OTHERS_COLOR,
      indicatorType: { shape: 'square' },
    }
    return meta
  }, [projectSeries])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const chartSeries: ChartSeries<string, TvlRow>[] = [
    ...projectSeries.map((series) => ({
      key: series.key,
      fill: series.color,
      stack: true,
      activeDot: true,
    })),
    {
      key: OTHERS_KEY,
      fill: OTHERS_COLOR,
      stroke: OTHERS_STROKE,
      strokeWidth: 1,
      strokeDasharray: '3 3',
      stack: true,
      activeDot: true,
    },
  ]

  const stats = getStats(chartData, projectKeys)
  const rangeLabel = getRangeLabel(shownInput.range, rangeOptions)

  return (
    <PrimaryCard>
      <ChartCardHeader
        title="Value locked"
        subtitle={
          <Tooltip>
            <TooltipTrigger className="translate-y-px">
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{DESCRIPTION}</TooltipContent>
          </Tooltip>
        }
        accessory={<TvsChartUnitControls unit={unit} setUnit={setUnit} />}
        value={stats && formatCurrency(stats.total, unit)}
        valueLabel={
          stats?.share !== undefined
            ? formatStakedEthShare(stats.share)
            : undefined
        }
        change={rangeLabel !== undefined ? stats?.change : undefined}
        rangeLabel={rangeLabel}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        meta={
          <ChartTimeRange
            timeRange={getChartTimeRangeFromData(chartData)}
            isPlaceholderData={isPlaceholderData}
          />
        }
      />
      <div className="mt-4">
        <ChartContainer
          data={chartData}
          meta={chartMeta}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          // Shorter than the other charts: it gives the page its context,
          // the comparison is in the charts and the table below.
          className="h-[148px] min-h-[148px] md:h-[164px] md:min-h-[164px] 2xl:h-[176px] 2xl:min-h-[176px]"
          interactiveLegend={{
            dataKeys,
            onItemClick: toggleDataKey,
            disableOnboarding: true,
          }}
          legend
          legendLeading={
            <ChartLegendToggleAll
              showAllSelected={showAllSelected}
              onToggleAll={toggleAllDataKeys}
            />
          }
        >
          <TimeSeriesChart
            data={chartData}
            series={chartSeries}
            ariaLabel="Value locked in liquid staking protocols and the rest of the ETH staked"
            yAxis={{
              format: (value) => formatCurrency(value, unit),
              tickCount: 3,
            }}
            renderTooltip={(row, keys) => (
              <CustomTooltip row={row} keys={keys} unit={unit} />
            )}
          />
        </ChartContainer>
      </div>
    </PrimaryCard>
  )
}

/** The protocols' latest total, its share of the stake and its change over the range. */
function getStats(rows: TvlRow[] | undefined, projectKeys: string[]) {
  const totals = (rows ?? []).flatMap((row) => {
    const values = projectKeys.map((key) => row[key] ?? null)
    if (values.some((value) => value === null)) return []
    const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0)
    const others = row[OTHERS_KEY] ?? null
    return [
      { total, share: others != null ? total / (total + others) : undefined },
    ]
  })
  const first = totals.at(0)
  const last = totals.at(-1)
  if (!first || !last) return undefined
  return {
    total: last.total,
    share: last.share,
    change: first.total > 0 ? last.total / first.total - 1 : undefined,
  }
}

/** Written after the change, e.g. "1y"; max has no start to compare against. */
function getRangeLabel(
  range: ChartRange,
  options: readonly { value: ChartRangeOptionValue }[],
): string | undefined {
  const option = rangeToOption(
    range,
    options.map((o) => o.value),
  )
  return option === 'max' || option === 'custom' ? undefined : option
}

function CustomTooltip({
  row,
  keys,
  unit,
}: {
  row: TvlRow
  keys: string[]
  unit: ChartUnit
}) {
  // Hidden series are not in `keys`.
  const entries = getTooltipEntries(row, keys, { skipNull: true })
  if (entries.length === 0) return null

  const protocols = entries
    .filter((entry) => entry.name !== OTHERS_KEY)
    .sort((a, b) => b.value - a.value)
  const others = entries.find((entry) => entry.name === OTHERS_KEY)
  // Shares are of the whole stake, so they need every layer, hidden or not.
  const allValues = Object.entries(row).filter(([key]) => key !== 'timestamp')
  const staked = allValues.every(([, value]) => value != null)
    ? allValues.reduce((sum, [, value]) => sum + (value ?? 0), 0)
    : undefined

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[220px] flex-col [@media(min-width:600px)]:w-64">
        <ChartTooltipTitle>
          {formatTimestamp(row.timestamp, { mode: 'date' })}
        </ChartTooltipTitle>
        {staked !== undefined && (
          <TooltipHeader
            className="mt-3"
            label="ETH staked"
            value={formatCurrency(staked, unit)}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          {protocols.map((entry) => (
            <TooltipRow
              key={entry.name}
              name={entry.name}
              value={entry.value}
              staked={staked}
              unit={unit}
            />
          ))}
          {others && (
            <div className="border-divider border-t pt-2">
              <TooltipRow
                name={others.name}
                value={others.value}
                staked={staked}
                unit={unit}
              />
            </div>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function TooltipRow({
  name,
  value,
  staked,
  unit,
}: {
  name: string
  value: number
  staked: number | undefined
  unit: ChartUnit
}) {
  return (
    <ChartTooltipRow name={name} gap="gap-x-3" wrapLabel={false}>
      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-medium text-label-value-15 text-primary tabular-nums">
          {formatCurrency(value, unit)}
        </span>
        {staked !== undefined && staked > 0 && (
          <span className="font-medium text-label-value-13 text-secondary tabular-nums">
            {formatPercent(value / staked)}
          </span>
        )}
      </span>
    </ChartTooltipRow>
  )
}
