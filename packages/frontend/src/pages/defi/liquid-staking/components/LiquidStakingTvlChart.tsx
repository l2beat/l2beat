import { formatCurrency, formatNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
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
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useIsClient } from '~/hooks/useIsClient'
import { InfoIcon } from '~/icons/Info'
import type { EthSupply } from '~/server/features/defi/liquid-staking/getEthSupply'
import { useTRPC } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { LiquidStakingChartProject } from './LiquidStakingCharts'
import type { LiquidStakingChartSeries } from './LiquidStakingLineChart'
import {
  type EthChange,
  formatChangePeriod,
  getLiquidStakingSummary,
  getStakeChange,
  getSupplyChange,
  type LiquidStakingSummaryStats,
} from './liquidStakingSummary'
import {
  NOT_STAKED_KEY,
  OTHERS_KEY,
  type TvlRow,
  toRow,
} from './liquidStakingTvlRows'

type TvlScope = 'staked' | 'supply' | 'liquid'

const OTHERS_COLOR = 'color-mix(in oklab, var(--secondary) 28%, transparent)'
const OTHERS_STROKE = 'var(--secondary)'
// Fainter than Others, so the staked layers stand out inside the supply.
const NOT_STAKED_COLOR =
  'color-mix(in oklab, var(--secondary) 10%, transparent)'

const DESCRIPTION = [
  "Each protocol's layer is the ETH its tokens stand for at its own exchange rate. In Staked view, the layers add up to the balance of all active Ethereum validators: Others is the rest, staked solo, through exchanges or through protocols not listed here.",
  "USD values are that ETH at the day's ETH price, so they can differ slightly from the TVL in the table, which prices the tokens themselves.",
  'A protocol also holds ETH not yet staked, or exited but not yet withdrawn, so Others can read slightly low. Days on which a protocol has no data show no Others.',
  "In vs. Supply view, Not staked is the rest of all ETH in existence. CoinGecko serves no supply history, so a day's supply is its market cap over its price; without an API key it reaches back 365 days.",
].join(' ')

interface Props {
  projects: LiquidStakingChartProject[]
  projectSeries: LiquidStakingChartSeries[]
  range: ChartRange
  /** Fixed 1Y range prefetched on SSR for the summary rail and 1Y change stats. */
  defaultRange: ChartRange
}

/**
 * Hero card: a one-sentence staking summary across the top, the ETH supply
 * share and staked breakdown on the left, and the stacked value locked chart
 * on the right.
 */
export function LiquidStakingTvlChart({
  projects,
  projectSeries,
  range,
  defaultRange,
}: Props) {
  const trpc = useTRPC()
  const isClient = useIsClient()
  // ETH by default: the stake is counted in ETH, and USD mostly moves with
  // ETH's price.
  const [unit, setUnit] = useState<ChartUnit>('eth')
  const [scope, setScope] = useState<TvlScope>('staked')

  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.defi.liquidStakingTvlChart,
    { range },
  )
  // Always keeps the summary rail on the latest numbers and 1Y stake change,
  // sharing the SSR-prefetched query when the chart is on 1Y.
  const { data: yearData, isLoading: isYearLoading } = useChartQuery(
    trpc.defi.liquidStakingTvlChart,
    { range: defaultRange },
  )
  const { data: ethSupply, isLoading: isSupplyLoading } = useQuery(
    trpc.defi.ethSupply.queryOptions(),
  )
  const { data: supplyHistory, isLoading: isSupplyHistoryLoading } = useQuery(
    trpc.defi.ethSupplyHistory.queryOptions(),
  )

  const projectKeys = useMemo(
    () => projectSeries.map((series) => series.key),
    [projectSeries],
  )
  const showOthers = scope !== 'liquid'
  const showSupply = scope === 'supply'

  const supplyByDay = useMemo(
    () =>
      new Map(supplyHistory?.map((day) => [day.timestamp, day.value]) ?? []),
    [supplyHistory],
  )
  const chartData = useMemo(() => {
    const rows = data?.map((point) =>
      toRow(
        point,
        projectKeys,
        unit,
        showSupply ? (supplyByDay.get(point.timestamp) ?? null) : undefined,
      ),
    )
    // No row with a value (USD with no prices) gets the no-data state, not
    // empty axes.
    return rows?.some(hasValue) ? rows : rows && []
  }, [data, projectKeys, unit, showSupply, supplyByDay])

  // Protocols in the table's order, the biggest at the bottom, and Others on
  // top when shown, so its upper edge traces total stake. Not staked tops the
  // stack at total supply in vs. Supply view.
  const chartMeta = useMemo<ChartMeta>(() => {
    const meta: ChartMeta = {}
    for (const series of projectSeries) {
      meta[series.key] = {
        label: series.label,
        color: series.color,
        indicatorType: { shape: 'square' },
      }
    }
    if (showOthers) {
      meta[OTHERS_KEY] = {
        label: 'Others',
        color: OTHERS_COLOR,
        indicatorType: { shape: 'square' },
      }
    }
    if (showSupply) {
      meta[NOT_STAKED_KEY] = {
        label: 'Not staked',
        color: NOT_STAKED_COLOR,
        indicatorType: { shape: 'square' },
      }
    }
    return meta
  }, [projectSeries, showOthers, showSupply])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const onScopeChange = (next: TvlScope) => {
    setScope(next)
    const wantsOthers = next !== 'liquid'
    const wantsSupply = next === 'supply'
    if (wantsOthers !== dataKeys.includes(OTHERS_KEY)) {
      toggleDataKey(OTHERS_KEY)
    }
    if (wantsSupply !== dataKeys.includes(NOT_STAKED_KEY)) {
      toggleDataKey(NOT_STAKED_KEY)
    }
  }

  const summary = useMemo(
    () =>
      yearData &&
      getLiquidStakingSummary(yearData, projectKeys, ethSupply?.value),
    [yearData, projectKeys, ethSupply],
  )
  const stakeChange = useMemo(
    () => yearData && getStakeChange(yearData),
    [yearData],
  )
  const supplyChange = useMemo(
    () => supplyHistory && getSupplyChange(supplyHistory),
    [supplyHistory],
  )

  const chartSeries: ChartSeries<string, TvlRow>[] = [
    ...projectSeries.map((series) => ({
      key: series.key,
      fill: series.color,
      stack: true,
      activeDot: true,
    })),
    ...(showOthers
      ? [
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
      : []),
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

  const colorByProject = useMemo(
    () => new Map(projectSeries.map((s) => [s.key, s.color])),
    [projectSeries],
  )

  const largestProject =
    summary?.largest && projects.find((p) => p.id === summary.largest?.id)
  const largestName =
    largestProject && (largestProject.shortName ?? largestProject.name)

  // The chart's headline is the top of the stack it shows on the range's
  // last day, so a custom range that ends in the past reads that day.
  const rangeSummary = useMemo(
    () => data && getLiquidStakingSummary(data, projectKeys, undefined),
    [data, projectKeys],
  )
  const rangeSupply =
    rangeSummary &&
    (supplyByDay.get(rangeSummary.timestamp) ??
      (rangeSummary.timestamp === summary?.timestamp
        ? ethSupply?.value
        : undefined))
  const chartHeadlineEth =
    scope === 'supply'
      ? rangeSupply
      : scope === 'liquid'
        ? rangeSummary?.liquid?.eth
        : rangeSummary?.ethStaked
  const chartHeadlineLabel =
    scope === 'supply'
      ? 'total ETH supply'
      : scope === 'liquid'
        ? 'liquid staking TVL'
        : 'total ETH staked'
  const chartHeadlineValue = formatInUnit(
    chartHeadlineEth,
    scope === 'liquid' ? rangeSummary?.sharesEthPrice : rangeSummary?.ethPrice,
    unit,
  )
  const chartHeadlineLoading =
    isLoading ||
    (scope === 'supply' && (isSupplyLoading || isSupplyHistoryLoading))

  return (
    <PrimaryCard className="overflow-hidden p-0 md:p-0 lg:col-span-2">
      <EditorialBanner
        projectsCount={projects.length}
        summary={summary}
        isLoading={isYearLoading}
        ethSupply={ethSupply ?? undefined}
        largestName={largestName}
        stakeChange={stakeChange}
        supplyChange={supplyChange}
      />

      <div className="grid min-w-0 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <SummaryRail
          projects={projects}
          colorByProject={colorByProject}
          summary={summary}
          unit={unit}
          scope={scope}
          dataKeys={dataKeys}
          showAllSelected={showAllSelected}
          onToggleKey={(key) => {
            if (key === OTHERS_KEY && scope === 'liquid') {
              onScopeChange('staked')
              return
            }
            toggleDataKey(key)
          }}
          onToggleAll={toggleAllDataKeys}
        />

        <div className="flex min-w-0 flex-col p-4 md:px-6 md:py-5">
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
                  Value locked over time
                </h2>
                <Tooltip>
                  <TooltipTrigger
                    className="translate-y-px text-secondary"
                    aria-label="About the value locked chart"
                  >
                    <InfoIcon className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>{DESCRIPTION}</TooltipContent>
                </Tooltip>
              </div>
              <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                {chartHeadlineValue !== undefined ? (
                  <span className="font-bold text-heading-28 text-primary tabular-nums leading-tight tracking-[-0.025em]">
                    {chartHeadlineValue}
                  </span>
                ) : chartHeadlineLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <NoDataBadge size="regular" />
                )}
                <span className="font-medium text-label-value-13 text-secondary">
                  {chartHeadlineLabel}
                </span>
              </div>
              <ChartTimeRange
                timeRange={getChartTimeRangeFromData(chartData)}
                isPlaceholderData={isPlaceholderData}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-end">
              {isClient ? (
                <RadioGroup
                  name="liquidStakingTvlScope"
                  value={scope}
                  onValueChange={(value) => onScopeChange(value as TvlScope)}
                >
                  <RadioGroupItem value="staked">Staked</RadioGroupItem>
                  <RadioGroupItem value="supply">vs. Supply</RadioGroupItem>
                  <RadioGroupItem value="liquid">Liquid only</RadioGroupItem>
                </RadioGroup>
              ) : (
                <Skeleton className="h-8 w-[228px]" />
              )}
              <TvsChartUnitControls unit={unit} setUnit={setUnit} />
            </div>
          </div>

          {/* On large screens the rail sets the card's height and the chart
              fills what is left; absolute so its measured size can't hold the
              column taller. */}
          <div className="mt-4 flex min-w-0 flex-1 flex-col lg:relative lg:min-h-[220px] lg:[&>div]:absolute lg:[&>div]:inset-0">
            <ChartContainer
              data={chartData}
              meta={chartMeta}
              isLoading={isLoading}
              isPlaceholderData={isPlaceholderData}
              className="h-[220px] min-h-[220px] md:h-[268px] md:min-h-[268px] lg:h-full lg:min-h-0 2xl:h-full 2xl:min-h-0"
              interactiveLegend={{
                dataKeys,
                onItemClick: toggleDataKey,
                disableOnboarding: true,
              }}
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
                  <CustomTooltip
                    row={row}
                    keys={keys}
                    unit={unit}
                    scope={scope}
                  />
                )}
              />
            </ChartContainer>
          </div>
        </div>
      </div>
    </PrimaryCard>
  )
}

function EditorialBanner({
  projectsCount,
  summary,
  isLoading,
  ethSupply,
  largestName,
  stakeChange,
  supplyChange,
}: {
  projectsCount: number
  summary: LiquidStakingSummaryStats | undefined
  isLoading: boolean
  ethSupply: EthSupply | undefined
  largestName: string | undefined
  stakeChange: EthChange | undefined
  supplyChange: EthChange | undefined
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-divider border-b px-4 py-4 md:px-6 md:py-5">
      {summary === undefined ? (
        isLoading ? (
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-7 w-96 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
        ) : (
          <NoDataBadge size="regular" />
        )
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <p className="text-pretty font-semibold text-heading-20 text-primary tabular-nums leading-tight tracking-[-0.02em] md:text-heading-24">
              {summary.supplyShare !== undefined &&
              summary.ethSupply !== undefined &&
              ethSupply ? (
                <>
                  <Tooltip>
                    <TooltipTrigger className="inline font-bold text-brand-deep underline decoration-brand-deep/30 decoration-dotted underline-offset-4">
                      {formatPercent(summary.supplyShare)}
                    </TooltipTrigger>
                    <TooltipContent>
                      The balance of all active validators as a share of all ETH
                      in existence: {formatNumber(ethSupply.value)} ETH
                      according to CoinGecko, as of{' '}
                      {formatTimestamp(ethSupply.timestamp, {
                        mode: 'datetime',
                      })}
                      .
                    </TooltipContent>
                  </Tooltip>{' '}
                  of all ETH is staked:{' '}
                  <strong className="whitespace-nowrap font-bold text-brand-deep">
                    {formatNumber(summary.ethStaked)}
                  </strong>{' '}
                  of{' '}
                  <span className="whitespace-nowrap">
                    {formatNumber(summary.ethSupply)} ETH
                  </span>
                </>
              ) : (
                <>
                  <strong className="whitespace-nowrap font-bold text-brand-deep">
                    {formatNumber(summary.ethStaked)} ETH
                  </strong>{' '}
                  is staked
                </>
              )}
            </p>
            {summary.liquid && (
              <p className="mt-1.5 text-pretty font-medium text-paragraph-14 text-secondary tabular-nums">
                The {projectsCount} liquid staking protocols hold{' '}
                <strong className="font-semibold text-primary">
                  {formatPercent(summary.liquid.share)}
                </strong>{' '}
                ({formatEth(summary.liquid.eth)})
                {largestName && summary.largest && (
                  <>
                    , led by{' '}
                    <strong className="font-semibold text-primary">
                      {largestName}
                    </strong>{' '}
                    at {formatPercent(summary.largest.share)} (
                    {formatEth(summary.largest.eth)})
                  </>
                )}
                .
              </p>
            )}
          </div>

          {(stakeChange || supplyChange) && (
            <div className="flex shrink-0 items-center gap-5 tabular-nums">
              {stakeChange && (
                <div
                  className="text-left sm:text-right"
                  title={formatChangeDates(stakeChange)}
                >
                  <div className="font-bold text-heading-20 text-primary leading-tight">
                    {formatSigned(stakeChange.value, formatPercent)}
                  </div>
                  <div className="font-medium text-label-value-12 text-secondary">
                    Staked · {formatChangePeriod(stakeChange)} (
                    {formatSigned(stakeChange.eth, formatEth)})
                  </div>
                </div>
              )}
              {stakeChange && supplyChange && (
                <div className="h-8 w-px bg-divider" />
              )}
              {supplyChange && (
                <div
                  className="text-left sm:text-right"
                  title={formatChangeDates(supplyChange)}
                >
                  <div className="font-bold text-heading-20 text-primary leading-tight">
                    {formatSigned(supplyChange.value, formatPercent)}
                  </div>
                  <div className="font-medium text-label-value-12 text-secondary">
                    Supply · {formatChangePeriod(supplyChange)} (
                    {formatSigned(supplyChange.eth, formatEth)})
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function SummaryRail({
  projects,
  colorByProject,
  summary,
  unit,
  scope,
  dataKeys,
  showAllSelected,
  onToggleKey,
  onToggleAll,
}: {
  projects: LiquidStakingChartProject[]
  colorByProject: Map<string, string>
  summary: LiquidStakingSummaryStats | undefined
  unit: ChartUnit
  scope: TvlScope
  dataKeys: string[]
  showAllSelected: boolean
  onToggleKey: (key: string) => void
  onToggleAll: () => void
}) {
  const projectById = useMemo(
    () => new Map(projects.map((p) => [p.id, p])),
    [projects],
  )
  const shareByProject = useMemo(
    () => new Map(summary?.byProject?.map((p) => [p.id, p]) ?? []),
    [summary],
  )

  const split = summary?.supplySplit

  const toUnit = (eth: number | undefined) =>
    formatInUnit(eth, summary?.sharesEthPrice, unit)
  const liquidColors = projects
    .slice(0, 3)
    .map((p) => colorByProject.get(p.id) ?? 'var(--brand)')
  const liquidSwatch =
    liquidColors.length > 1
      ? `linear-gradient(135deg, ${liquidColors.join(', ')})`
      : (liquidColors[0] ?? 'var(--brand)')

  return (
    <div className="flex min-w-0 flex-col gap-4 border-divider p-4 max-lg:order-last max-lg:border-t md:px-6 md:py-5 lg:border-r">
      {split && (
        <div>
          <div className="mb-2 font-semibold text-[11px] text-secondary uppercase leading-none tracking-[0.06em]">
            ETH supply share
          </div>
          <div
            className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-surface-secondary"
            role="img"
            aria-label={`ETH supply breakdown: ${formatPercent(split.liquid.share)} liquid staking, ${formatPercent(split.others.share)} other staked, ${formatPercent(split.unstaked.share)} unstaked`}
          >
            {projects.map((project) => {
              const entry = shareByProject.get(project.id)
              if (!entry || !summary?.ethSupply) return null
              const width = (entry.eth / summary.ethSupply) * 100
              if (width <= 0) return null
              return (
                <div
                  key={project.id}
                  className="h-full"
                  style={{
                    width: `${width}%`,
                    backgroundColor:
                      colorByProject.get(project.id) ?? 'var(--secondary)',
                  }}
                />
              )
            })}
            <div
              className="h-full"
              style={{
                width: `${split.others.share * 100}%`,
                backgroundColor:
                  'color-mix(in oklab, var(--secondary) 50%, transparent)',
              }}
            />
          </div>
          <div className="mt-2 flex flex-col gap-0.5">
            <SupplyRow
              swatch={
                <span
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{ background: liquidSwatch }}
                />
              }
              label="Liquid staking"
              value={toUnit(split.liquid.eth)}
              share={formatPercent(split.liquid.share)}
            />
            <SupplyRow
              swatch={
                <span
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor:
                      'color-mix(in oklab, var(--secondary) 50%, transparent)',
                  }}
                />
              }
              label="Other staked"
              value={toUnit(split.others.eth)}
              share={formatPercent(split.others.share)}
            />
            <SupplyRow
              swatch={
                <span className="size-2 shrink-0 rounded-[2px] bg-surface-secondary" />
              }
              label="Unstaked"
              value={toUnit(split.unstaked.eth)}
              share={formatPercent(split.unstaked.share)}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col border-divider border-t pt-3 lg:flex-1">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-semibold text-[11px] text-secondary uppercase leading-none tracking-[0.06em]">
            Staked breakdown
          </span>
          <button
            type="button"
            onClick={onToggleAll}
            className="cursor-pointer font-medium text-[11px] text-secondary leading-none transition-colors hover:text-primary"
          >
            {showAllSelected ? 'Hide all' : 'Show all'}
          </button>
        </div>

        <div className="flex flex-col gap-0.5 md:max-lg:grid md:max-lg:grid-cols-2 md:max-lg:gap-x-8">
          {projects.map((project) => {
            const stats = shareByProject.get(project.id)
            const active = dataKeys.includes(project.id)
            const color = colorByProject.get(project.id) ?? 'var(--secondary)'
            return (
              <BreakdownRow
                key={project.id}
                active={active}
                onClick={() => onToggleKey(project.id)}
                swatch={
                  <span
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: color }}
                  />
                }
                icon={projectById.get(project.id)?.icon}
                label={project.shortName ?? project.name}
                value={toUnit(stats?.eth)}
                share={
                  stats !== undefined ? formatPercent(stats.share) : undefined
                }
              />
            )
          })}

          <BreakdownRow
            active={scope !== 'liquid' && dataKeys.includes(OTHERS_KEY)}
            onClick={() => onToggleKey(OTHERS_KEY)}
            swatch={
              <span
                className="size-2 shrink-0 rounded-[2px] border border-dashed"
                style={{
                  backgroundColor: OTHERS_COLOR,
                  borderColor: OTHERS_STROKE,
                }}
              />
            }
            label="Others"
            value={toUnit(summary?.others?.eth)}
            share={
              summary?.others !== undefined
                ? formatPercent(summary.others.share)
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}

function SupplyRow({
  swatch,
  label,
  value,
  share,
}: {
  swatch: React.ReactNode
  label: string
  value?: string
  share: string
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="flex min-w-0 items-center gap-1.5">
        {swatch}
        <span className="truncate font-medium text-label-value-13 text-primary">
          {label}
        </span>
      </span>
      <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap tabular-nums">
        {value !== undefined && (
          <span className="font-semibold text-label-value-13 text-primary">
            {value}
          </span>
        )}
        <span className="min-w-[38px] text-right font-medium text-label-value-12 text-secondary">
          {share}
        </span>
      </span>
    </div>
  )
}

function BreakdownRow({
  active,
  onClick,
  swatch,
  icon,
  label,
  value,
  share,
}: {
  active: boolean
  onClick: () => void
  swatch: React.ReactNode
  icon?: string
  label: string
  value?: string
  share?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        '-mx-1.5 flex w-[calc(100%+12px)] cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left transition-colors hover:bg-surface-secondary',
        !active && 'opacity-40',
      )}
    >
      <span className="flex min-w-0 items-center gap-1.5">
        {swatch}
        {icon && (
          <img
            src={icon}
            alt=""
            width={14}
            height={14}
            className="size-3.5 shrink-0 rounded-full"
          />
        )}
        <span className="truncate font-medium text-label-value-13 text-primary">
          {label}
        </span>
      </span>
      <span className="flex shrink-0 items-baseline gap-2 whitespace-nowrap tabular-nums">
        {value !== undefined && (
          <span className="font-semibold text-label-value-13 text-primary">
            {value}
          </span>
        )}
        {share !== undefined && (
          <span className="min-w-[38px] text-right font-medium text-label-value-12 text-secondary">
            {share}
          </span>
        )}
      </span>
    </button>
  )
}

function formatEth(value: number): string {
  return `${formatNumber(value)} ETH`
}

function formatInUnit(
  eth: number | undefined,
  ethPrice: number | undefined,
  unit: ChartUnit,
): string | undefined {
  if (eth === undefined) return undefined
  if (unit === 'eth') return formatCurrency(eth, 'eth')
  // No price, no USD: an ETH amount here would read as the wrong unit.
  return ethPrice !== undefined
    ? formatCurrency(eth * ethPrice, 'usd')
    : undefined
}

function formatSigned(value: number, format: (abs: number) => string) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${format(Math.abs(value))}`
}

function formatChangeDates(change: EthChange): string {
  return `${formatTimestamp(change.since, { mode: 'date' })} to ${formatTimestamp(change.until, { mode: 'date' })}`
}

function CustomTooltip({
  row,
  keys,
  unit,
  scope,
}: {
  row: TvlRow
  keys: string[]
  unit: ChartUnit
  scope: TvlScope
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

  // Shares are of the whole stake in Staked / vs. Supply views, and of liquid
  // staking TVL in Liquid only view, so visible protocol percentages stay
  // consistent with the tooltip header.
  const protocolValues = Object.entries(row).filter(
    ([key]) =>
      key !== 'timestamp' && key !== OTHERS_KEY && key !== NOT_STAKED_KEY,
  )
  const liquidTotal = protocolValues.every(([, value]) => value != null)
    ? protocolValues.reduce((sum, [, value]) => sum + (value ?? 0), 0)
    : undefined
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

  const headerLabel = scope === 'liquid' ? 'Liquid staking' : 'ETH staked'
  const headerTotal = scope === 'liquid' ? liquidTotal : staked

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[220px] flex-col [@media(min-width:600px)]:w-64">
        <ChartTooltipTitle>
          {formatTimestamp(row.timestamp, { mode: 'date' })}
        </ChartTooltipTitle>
        {headerTotal !== undefined && (
          <TooltipHeader
            className="mt-3"
            label={headerLabel}
            value={formatCurrency(headerTotal, unit)}
          />
        )}
        <div className="mt-2 flex flex-col gap-2">
          {protocols.map((entry) => (
            <TooltipRow
              key={entry.name}
              name={entry.name}
              value={entry.value}
              total={headerTotal}
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

function hasValue(row: TvlRow): boolean {
  return Object.entries(row).some(
    ([key, value]) => key !== 'timestamp' && value !== null,
  )
}
