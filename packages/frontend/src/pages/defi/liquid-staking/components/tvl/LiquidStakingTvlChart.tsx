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
import type { ChartRangeOptionValue } from '~/components/core/chart/utils/rangeToOption'
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
  type CompleteTvlBreakdown,
  getTvlChanges,
  type TvlBreakdown,
} from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import { SUPPLY_SOURCE } from '../../liquidStakingMetrics'
import type { LiquidStakingChartProject } from '../LiquidStakingCharts'
import type { LiquidStakingChartSeries } from '../LiquidStakingLineChart'
import { LiquidStakingTvlBanner } from './LiquidStakingTvlBanner'
import { LiquidStakingTvlRail } from './LiquidStakingTvlRail'
import { LiquidStakingTvlTooltip } from './LiquidStakingTvlTooltip'
import {
  getProtocolLayers,
  inUnit,
  stackOnKnown,
  type TvlLayer,
  type TvlScope,
  VIEWS,
} from './liquidStakingTvlLayers'

const DESCRIPTION = [
  "Each protocol's layer is the ETH its tokens stand for at its own exchange rate. In Staked view, the layers add up to the balance of all active Ethereum validators: Other stakers is the rest, staked solo, through exchanges or through protocols not shown here.",
  "USD values are that ETH at the day's ETH price, so they can differ slightly from the TVL in the table, which prices the tokens themselves.",
  'A protocol also holds ETH not yet staked, or exited but not yet withdrawn, so Other stakers can read slightly low. Days on which a protocol has no data show no Other stakers.',
  `In vs. Supply view, Not staked is the rest of ETH's supply: ${SUPPLY_SOURCE} Above a protocol without data for a day, the stack shows nothing that day.`,
].join(' ')

export function LiquidStakingTvlChart({
  projects,
  projectSeries,
  latest,
  range,
  rangePreset,
}: {
  projects: LiquidStakingChartProject[]
  projectSeries: LiquidStakingChartSeries[]
  /** The latest day, from the server, whatever the chart's range. */
  latest: CompleteTvlBreakdown | undefined
  range: ChartRange
  rangePreset?: ChartRangeOptionValue | 'custom'
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

  const changes = useMemo(
    () => (data && latest ? getTvlChanges(data, latest) : undefined),
    [data, latest],
  )

  const view = VIEWS[scope]
  const protocolLayers = useMemo(
    () => getProtocolLayers(projectSeries),
    [projectSeries],
  )
  const layers = useMemo(
    () => [...protocolLayers, ...view.layers],
    [protocolLayers, view],
  )
  const stakedLayers = useMemo(
    () => [...protocolLayers, ...VIEWS.staked.layers],
    [protocolLayers],
  )
  const chartData = useMemo(() => {
    if (!data) return undefined
    const rows = data.map((day) => inUnit(day, unit))
    // No row with a value (USD with no prices) gets the no-data state, not
    // empty axes.
    const hasValue = rows.some((row) =>
      layers.some((layer) => layer.value(row) !== null),
    )
    return hasValue ? rows : []
  }, [data, unit, layers])

  const protocolMeta = useMemo(() => toMeta(protocolLayers), [protocolLayers])
  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(protocolMeta)
  const chartMeta = useMemo(() => toMeta(layers), [layers])
  const visibleKeys = useMemo(
    () =>
      layers
        .filter(
          (layer) => layer.role !== 'protocol' || dataKeys.includes(layer.key),
        )
        .map((layer) => layer.key),
    [layers, dataKeys],
  )
  const drawnLayers = useMemo(
    () =>
      stackOnKnown(layers.filter((layer) => visibleKeys.includes(layer.key))),
    [layers, visibleKeys],
  )
  const onToggleLayer = (layer: TvlLayer) => {
    if (layer.toggleScope) setScope(layer.toggleScope(scope))
    else toggleDataKey(layer.key)
  }
  const onLegendClick = (key: string) => {
    const layer = layers.find((layer) => layer.key === key)
    if (layer) onToggleLayer(layer)
  }

  const chartSeries: ChartSeries<string, TvlBreakdown>[] = drawnLayers.map(
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

  const headlineRow = chartData?.findLast((row) => view.total(row) !== null)
  const headline = headlineRow ? view.total(headlineRow) : null
  const headlineDate =
    headlineRow && headlineRow !== chartData?.at(-1)
      ? ` on ${formatTimestamp(headlineRow.timestamp, { mode: 'date' })}`
      : ''

  return (
    <PrimaryCard className="p-0 md:p-0 lg:col-span-2">
      <LiquidStakingTvlBanner
        projects={projects}
        latest={latest}
        changes={changes}
        rangePreset={rangePreset}
      />

      <div className="grid min-w-0 lg:grid-cols-[310px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <LiquidStakingTvlRail
          layers={stakedLayers}
          latest={latest}
          unit={unit}
          visibleKeys={visibleKeys}
          showAllSelected={showAllSelected}
          onToggleLayer={onToggleLayer}
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
                {headline !== null ? (
                  <span className="font-bold text-heading-28 text-primary tabular-nums leading-tight tracking-[-0.025em]">
                    {formatCurrency(headline, unit)}
                  </span>
                ) : isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <NoDataBadge size="regular" />
                )}
                <span className="font-medium text-label-value-13 text-secondary">
                  {view.totalLabel}
                  {headlineDate}
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
                  {Object.entries(VIEWS).map(([value, { label }]) => (
                    <RadioGroupItem key={value} value={value}>
                      {label}
                    </RadioGroupItem>
                  ))}
                </RadioGroup>
              ) : (
                <Skeleton className="h-8 w-[228px]" />
              )}
              <TvsChartUnitControls unit={unit} setUnit={setUnit} />
            </div>
          </div>

          {/* On large screens the chart's minimum height sets the card's,
              and the rail's protocol list scrolls in what that leaves;
              absolute so the chart's measured size can't hold the column
              taller. */}
          <div className="mt-4 flex min-w-0 flex-1 flex-col lg:relative lg:min-h-[220px] lg:[&>div]:absolute lg:[&>div]:inset-0">
            <ChartContainer
              data={chartData}
              meta={chartMeta}
              isLoading={isLoading}
              isPlaceholderData={isPlaceholderData}
              className="h-[220px] min-h-[220px] md:h-[268px] md:min-h-[268px] lg:h-full lg:min-h-0 2xl:h-full 2xl:min-h-0"
              interactiveLegend={{
                dataKeys: visibleKeys,
                onItemClick: onLegendClick,
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
                renderTooltip={(row) => (
                  <LiquidStakingTvlTooltip
                    row={row}
                    layers={drawnLayers}
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
