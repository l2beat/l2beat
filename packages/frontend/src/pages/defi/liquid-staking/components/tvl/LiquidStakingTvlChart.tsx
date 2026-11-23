import { formatCurrency } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { NoDataBadge } from '~/components/badge/NoDataBadge'
import { TvsChartUnitControls } from '~/components/chart/tvs/TvsChartUnitControls'
import type { ChartUnit } from '~/components/chart/types'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
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
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { useIsClient } from '~/hooks/useIsClient'
import { InfoIcon } from '~/icons/Info'
import {
  type LiquidStakingTvlSummary,
  type TvlBreakdown,
  toBreakdown,
} from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import type { LiquidStakingChartProject } from '../LiquidStakingCharts'
import type { LiquidStakingChartSeries } from '../LiquidStakingLineChart'
import { LiquidStakingTvlBanner } from './LiquidStakingTvlBanner'
import { LiquidStakingTvlRail } from './LiquidStakingTvlRail'
import { LiquidStakingTvlTooltip } from './LiquidStakingTvlTooltip'
import {
  getLayers,
  getToggledScope,
  inUnit,
  SCOPE_TOTALS,
  type TvlLayer,
  type TvlScope,
} from './liquidStakingTvlLayers'

const DESCRIPTION = [
  "Each protocol's layer is the ETH its tokens stand for at its own exchange rate. In Staked view, the layers add up to the balance of all active Ethereum validators: Others is the rest, staked solo, through exchanges or through protocols not listed here.",
  "USD values are that ETH at the day's ETH price, so they can differ slightly from the TVL in the table, which prices the tokens themselves.",
  'A protocol also holds ETH not yet staked, or exited but not yet withdrawn, so Others can read slightly low. Days on which a protocol has no data show no Others.',
  "In vs. Supply view, Not staked is the rest of all ETH in existence. A day's supply is CoinGecko's market cap over its price.",
].join(' ')

/**
 * Hero card: a one-sentence staking summary across the top, the ETH supply
 * share and staked breakdown on the left, and the stacked value locked chart
 * on the right.
 */
export function LiquidStakingTvlChart({
  projects,
  projectSeries,
  summary,
  range,
}: {
  projects: LiquidStakingChartProject[]
  projectSeries: LiquidStakingChartSeries[]
  /** The latest numbers, from the server, whatever the chart's range. */
  summary: LiquidStakingTvlSummary | undefined
  range: ChartRange
}) {
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

  const layers = useMemo(
    () => getLayers(projectSeries, scope),
    [projectSeries, scope],
  )
  const breakdowns = useMemo(() => {
    const projectIds = projectSeries.map((series) => series.key)
    return data?.map((point) => toBreakdown(point, projectIds))
  }, [data, projectSeries])
  const chartData = useMemo(() => {
    if (!breakdowns) return undefined
    const rows = breakdowns.map((breakdown) => inUnit(breakdown, unit))
    // No row with a value (USD with no prices) gets the no-data state, not
    // empty axes.
    const hasValue = rows.some((row) =>
      layers.some((layer) => layer.value(row) !== null),
    )
    return hasValue ? rows : []
  }, [breakdowns, unit, layers])

  // Only the protocols are toggled one by one; Others and Not staked come
  // with the view.
  const protocolMeta = useMemo(
    () => toMeta(getLayers(projectSeries, 'liquid')),
    [projectSeries],
  )
  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(protocolMeta)
  const chartMeta = useMemo(() => toMeta(layers), [layers])
  const visibleKeys = layers
    .map((layer) => layer.key)
    .filter((key) => !(key in protocolMeta) || dataKeys.includes(key))
  const onToggleKey = (key: string) => {
    const nextScope = getToggledScope(scope, key)
    if (nextScope) setScope(nextScope)
    else toggleDataKey(key)
  }

  const chartSeries: ChartSeries<string, TvlBreakdown>[] = layers.map(
    (layer) => ({
      key: layer.key,
      value: layer.value,
      fill: layer.fill,
      stroke: layer.stroke,
      strokeWidth: layer.stroke ? 1 : undefined,
      strokeDasharray: layer.strokeDasharray,
      stack: true,
      activeDot: true,
    }),
  )

  // The top of the stack on the range's last day with it, so a custom range
  // that ends in the past reads that day.
  const total = SCOPE_TOTALS[scope]
  const headline = chartData
    ?.map((row) => total.value(row))
    .findLast((value) => value !== null)

  return (
    <PrimaryCard className="overflow-hidden p-0 md:p-0 lg:col-span-2">
      <LiquidStakingTvlBanner projects={projects} summary={summary} />

      <div className="grid min-w-0 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <LiquidStakingTvlRail
          projectSeries={projectSeries}
          latest={summary?.latest}
          unit={unit}
          visibleKeys={visibleKeys}
          showAllSelected={showAllSelected}
          onToggleKey={onToggleKey}
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
                {headline != null ? (
                  <span className="font-bold text-heading-28 text-primary tabular-nums leading-tight tracking-[-0.025em]">
                    {formatCurrency(headline, unit)}
                  </span>
                ) : isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <NoDataBadge size="regular" />
                )}
                <span className="font-medium text-label-value-13 text-secondary">
                  {total.label}
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
                  onValueChange={(value) => setScope(value as TvlScope)}
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
                dataKeys: visibleKeys,
                onItemClick: onToggleKey,
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
                  <LiquidStakingTvlTooltip
                    row={row}
                    visibleKeys={keys}
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

function toMeta(layers: TvlLayer[]): ChartMeta {
  return Object.fromEntries(
    layers.map((layer) => [
      layer.key,
      {
        label: layer.label,
        color: layer.fill,
        indicatorType: { shape: 'square' },
      },
    ]),
  )
}
