import { formatCurrency, formatNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { Checkbox } from '~/components/core/Checkbox'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import type { EthSupply } from '~/server/features/defi/liquid-staking/getEthSupply'
import type { LiquidStakingTvlPoint } from '~/server/features/defi/liquid-staking/getLiquidStakingTvlChart'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { LiquidStakingChartSeries } from './LiquidStakingLineChart'
import {
  NOT_STAKED_KEY,
  OTHERS_KEY,
  type TvlRow,
  toRow,
} from './liquidStakingTvlRows'

const OTHERS_COLOR = 'color-mix(in oklab, var(--secondary) 28%, transparent)'
const OTHERS_STROKE = 'var(--secondary)'
// Fainter than Others, so the staked layers stand out inside the supply.
const NOT_STAKED_COLOR =
  'color-mix(in oklab, var(--secondary) 10%, transparent)'

const DESCRIPTION = [
  "Each protocol's layer is the ETH its tokens stand for at its own exchange rate. The layers add up to the balance of all active Ethereum validators: Others is the rest, staked solo, through exchanges or through protocols not listed here.",
  "USD values are that ETH at the day's ETH price, so they can differ slightly from the TVL in the table, which prices the tokens themselves.",
  'A protocol also holds ETH not yet staked, or exited but not yet withdrawn, so Others can read slightly low. Days on which a protocol has no data show no Others.',
  "With the total supply shown, Not staked is the rest of all ETH in existence. CoinGecko serves no supply history, so a day's supply is its market cap over its price; without an API key it reaches back 365 days.",
].join(' ')

interface Props {
  projectSeries: LiquidStakingChartSeries[]
  range: ChartRange
}

/**
 * The ETH staked network-wide, split into the liquid staking protocols and
 * everyone else, stacked over time.
 */
export function LiquidStakingTvlChart({ projectSeries, range }: Props) {
  const trpc = useTRPC()
  // ETH by default: the stake is counted in ETH, and USD mostly moves with
  // ETH's price.
  const [unit, setUnit] = useState<ChartUnit>('eth')
  const [showSupply, setShowSupply] = useState(false)
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.defi.liquidStakingTvlChart,
    { range },
  )

  const projectKeys = useMemo(
    () => projectSeries.map((series) => series.key),
    [projectSeries],
  )
  // Asked for only once the supply is shown.
  const { data: supplyHistory } = useQuery({
    ...trpc.defi.ethSupplyHistory.queryOptions(),
    enabled: showSupply,
  })
  const supplyByDay = useMemo(
    () =>
      new Map(supplyHistory?.map((day) => [day.timestamp, day.value]) ?? []),
    [supplyHistory],
  )
  const chartData = useMemo(
    () =>
      data?.map((point) =>
        toRow(
          point,
          projectKeys,
          unit,
          showSupply ? (supplyByDay.get(point.timestamp) ?? null) : undefined,
        ),
      ),
    [data, projectKeys, unit, showSupply, supplyByDay],
  )

  // Protocols in the table's order, the biggest at the bottom, and Others
  // on top, so its upper edge traces the total stake. Not staked, when
  // shown, tops the stack at the total supply.
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
    if (showSupply) {
      meta[NOT_STAKED_KEY] = {
        label: 'Not staked',
        color: NOT_STAKED_COLOR,
        indicatorType: { shape: 'square' },
      }
    }
    return meta
  }, [projectSeries, showSupply])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  // The legend keeps the keys it started with, so the layer is selected
  // with the box, and dropped with it so "Hide all" still counts right.
  const onShowSupplyChange = (checked: boolean) => {
    setShowSupply(checked)
    if (checked !== dataKeys.includes(NOT_STAKED_KEY)) {
      toggleDataKey(NOT_STAKED_KEY)
    }
  }

  const { data: ethSupply } = useQuery(trpc.defi.ethSupply.queryOptions())
  const ethStaked = getLatestEthStaked(data, unit)
  const ethStakedEth = getLatestEthStaked(data, 'eth')

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
    ...(showSupply
      ? [
          {
            key: NOT_STAKED_KEY,
            fill: NOT_STAKED_COLOR,
            stroke: OTHERS_STROKE,
            strokeWidth: 1,
            stack: true,
            activeDot: true,
          },
        ]
      : []),
  ]

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
        accessory={
          <>
            <Checkbox
              name="showEthSupply"
              checked={showSupply}
              onCheckedChange={(checked) =>
                onShowSupplyChange(checked === true)
              }
            >
              <span className="max-sm:hidden">Show ETH total supply</span>
              <span className="sm:hidden">ETH supply</span>
            </Checkbox>
            <TvsChartUnitControls unit={unit} setUnit={setUnit} />
          </>
        }
        value={
          ethStaked !== undefined ? formatCurrency(ethStaked, unit) : undefined
        }
        valueLabel={
          <>
            {/* Shorter on phones, so the figure, label and pill fit one line. */}
            <span className="max-sm:hidden">total ETH staked</span>
            <span className="sm:hidden">ETH staked</span>
            {ethSupply && ethStakedEth !== undefined && (
              <SupplyShare staked={ethStakedEth} supply={ethSupply} />
            )}
          </>
        }
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

/** The latest ETH staked network-wide, in the chosen unit. */
function getLatestEthStaked(
  points: LiquidStakingTvlPoint[] | undefined,
  unit: ChartUnit,
): number | undefined {
  const latest = points?.findLast(
    (point) =>
      point.ethStaked != null && (unit === 'eth' || point.ethPrice != null),
  )
  if (latest?.ethStaked == null) return undefined
  return unit === 'usd'
    ? latest.ethStaked * (latest.ethPrice ?? 0)
    : latest.ethStaked
}

/** E.g. "· 27.1% of ETH supply", with where the supply comes from. */
function SupplyShare({
  staked,
  supply,
}: {
  staked: number
  supply: EthSupply
}) {
  return (
    <Tooltip>
      {/* A pill, so the share reads as a second figure, not as a label. */}
      <TooltipTrigger className="ml-2 inline-flex items-baseline gap-1 whitespace-nowrap rounded-full bg-surface-secondary px-2.5 py-1">
        <span className="font-semibold text-label-value-16 text-primary tabular-nums">
          {formatPercent(staked / supply.value)}
        </span>
        <span className="font-medium text-label-value-13 text-secondary">
          of <span className="max-sm:hidden">ETH </span>supply
        </span>
      </TooltipTrigger>
      <TooltipContent>
        The balance of all active validators as a share of all ETH in existence:{' '}
        {formatNumber(supply.value)} ETH according to CoinGecko, as of{' '}
        {formatTimestamp(supply.timestamp, { mode: 'datetime' })}.
      </TooltipContent>
    </Tooltip>
  )
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
    .filter(
      (entry) => entry.name !== OTHERS_KEY && entry.name !== NOT_STAKED_KEY,
    )
    .sort((a, b) => b.value - a.value)
  const others = entries.find((entry) => entry.name === OTHERS_KEY)
  const notStaked = entries.find((entry) => entry.name === NOT_STAKED_KEY)
  // Shares are of the whole stake, so they need every staked layer, hidden
  // or not; Not staked is a share of the supply.
  const stakedValues = Object.entries(row).filter(
    ([key]) => key !== 'timestamp' && key !== NOT_STAKED_KEY,
  )
  const staked = stakedValues.every(([, value]) => value != null)
    ? stakedValues.reduce((sum, [, value]) => sum + (value ?? 0), 0)
    : undefined
  const supply =
    staked !== undefined && row[NOT_STAKED_KEY] != null
      ? staked + row[NOT_STAKED_KEY]
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
              total={staked}
              unit={unit}
            />
          ))}
          {others && (
            <div className="border-divider border-t pt-2">
              <TooltipRow
                name={others.name}
                value={others.value}
                total={staked}
                unit={unit}
              />
            </div>
          )}
          {notStaked && (
            <div className="flex flex-col gap-2 border-divider border-t pt-2">
              <TooltipRow
                name={notStaked.name}
                value={notStaked.value}
                total={supply}
                unit={unit}
              />
              {supply !== undefined && (
                <div className="flex justify-between font-medium text-label-value-13 text-secondary tabular-nums">
                  <span>ETH supply</span>
                  <span>{formatCurrency(supply, unit)}</span>
                </div>
              )}
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
  total,
  unit,
}: {
  name: string
  value: number
  /** What the value is a share of. */
  total: number | undefined
  unit: ChartUnit
}) {
  return (
    <ChartTooltipRow name={name} gap="gap-x-3" wrapLabel={false}>
      <span className="flex items-baseline gap-1 whitespace-nowrap">
        <span className="font-medium text-label-value-15 text-primary tabular-nums">
          {formatCurrency(value, unit)}
        </span>
        {total !== undefined && total > 0 && (
          <span className="font-medium text-label-value-13 text-secondary tabular-nums">
            {formatPercent(value / total)}
          </span>
        )}
      </span>
    </ChartTooltipRow>
  )
}
