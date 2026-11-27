import {
  formatCurrency,
  formatNumber,
  formatNumberWithCommas,
} from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { type ReactNode, useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import {
  ChartRangeControls,
  type ChartRangeOptionValue,
  rangeToOption,
} from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import {
  type ChartTimeRangeValue,
  getChartTimeRangeFromData,
} from '~/components/core/chart/utils/getChartTimeRangeFromData'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import type { LiquidStakingEntry } from '~/server/features/defi/liquid-staking/getLiquidStakingEntries'
import type { CompleteTvlBreakdown } from '~/server/features/defi/liquid-staking/liquidStakingTvlBreakdown'
import { useTRPC } from '~/trpc/React'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'
import { ALL_ROUTES_COST_OF_EXIT } from '../costOfExitDescription'
import { formatDays, formatYield } from '../formatLiquidStaking'
import {
  COST_OF_EXIT_METRIC,
  ETH_STAKED_TITLE,
  formatEthStaked,
  formatMetricDate,
  YIELD_METRIC,
} from '../liquidStakingMetrics'
import {
  type LiquidStakingChartBackground,
  type LiquidStakingChartData,
  type LiquidStakingChartSeries,
  LiquidStakingLineChart,
} from './LiquidStakingLineChart'
import { LiquidStakingTvlChart } from './tvl/LiquidStakingTvlChart'

export type LiquidStakingChartProject = Pick<
  LiquidStakingEntry,
  'id' | 'name' | 'shortName' | 'icon'
>

const NETWORK_KEY = 'network'
/**
 * The cost of exit chart draws no higher than this, so a thin pool or a yield
 * near zero, at thousands of days, can't squash the other lines. The tooltip
 * keeps the real value.
 */
const MAX_DRAWN_DAYS = 365
const ETH_STAKED_KEY = 'ethStaked'

export const LIQUID_STAKING_RANGE_OPTIONS: {
  value: ChartRangeOptionValue
  label: string
}[] = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '180d', label: '180D' },
  { value: '1y', label: '1Y' },
  { value: 'max', label: 'MAX' },
]

export function LiquidStakingCharts({
  projects,
  tvlLatest,
  defaultRange,
}: {
  projects: (LiquidStakingChartProject & Pick<LiquidStakingEntry, 'risks'>)[]
  tvlLatest: CompleteTvlBreakdown | undefined
  defaultRange: ChartRange
}) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const projectSeries = useMemo(() => getProjectSeries(projects), [projects])
  // As in the table, the protocols research hasn't reviewed start hidden.
  const unreviewedKeys = useMemo(
    () =>
      projects
        .filter((project) => project.risks === undefined)
        .map((project) => project.id),
    [projects],
  )
  const rangePreset = useMemo(
    () =>
      rangeToOption(
        range,
        LIQUID_STAKING_RANGE_OPTIONS.map((option) => option.value),
      ),
    [range],
  )

  return (
    // The range bar drives every chart below it, so it heads them.
    <div className="flex flex-col">
      <ChartControlsWrapper className="mb-4 justify-end max-md:pr-4 md:mt-4">
        <ChartRangeControls
          name="liquid-staking"
          value={range}
          setValue={setRange}
          options={LIQUID_STAKING_RANGE_OPTIONS}
        />
      </ChartControlsWrapper>
      <div className="grid max-md:divide-y max-md:divide-divider md:gap-4 lg:grid-cols-2">
        <LiquidStakingTvlChart
          projects={projects}
          projectSeries={projectSeries}
          latest={tvlLatest}
          range={range}
          rangePreset={rangePreset}
        />
        <YieldChart
          projectSeries={projectSeries}
          hiddenKeys={unreviewedKeys}
          range={range}
          frame={ChartCard}
        />
        <CostOfExitChart
          projectSeries={projectSeries}
          hiddenKeys={unreviewedKeys}
          range={range}
          description={ALL_ROUTES_COST_OF_EXIT.chart}
          frame={ChartCard}
        />
      </div>
    </div>
  )
}

/** A line per project, each in its own colour. */
export function getProjectSeries(
  projects: LiquidStakingChartProject[],
): LiquidStakingChartSeries[] {
  const colors = generateAccessibleColors(projects.length)
  return projects.map((project, i) => ({
    key: project.id,
    label: <ProjectLabel project={project} />,
    color: colors[i] ?? 'var(--secondary)',
  }))
}

export interface LiquidStakingChartFrameProps {
  title: string
  /** What the chart measures and where the data comes from. */
  description: string
  timeRange: ChartTimeRangeValue
  isPlaceholderData: boolean
  children: ReactNode
}

interface ChartProps {
  projectSeries: LiquidStakingChartSeries[]
  /** Lines that start hidden; the legend shows them. */
  hiddenKeys?: string[]
  range: ChartRange
  /** Only this project's line, for its own page. */
  projectId?: string
  /** Lays out the title, description and time range around the chart. */
  frame: (props: LiquidStakingChartFrameProps) => ReactNode
}

export function YieldChart({
  projectSeries,
  hiddenKeys,
  range,
  projectId,
  frame,
}: ChartProps) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.defi.liquidStakingYieldChart,
    { range, projectId },
  )

  const series = useMemo(
    () => [
      ...projectSeries,
      {
        key: NETWORK_KEY,
        label: 'Network average',
        color: 'var(--chart-ethereum)',
        dashed: true,
      },
    ],
    [projectSeries],
  )
  const chartData = useMemo<LiquidStakingChartData | undefined>(
    () =>
      withProjectValues(
        data?.map((point) => ({
          timestamp: point.timestamp,
          ...point.projects,
          [NETWORK_KEY]: point.network,
          [ETH_STAKED_KEY]: point.ethStaked,
        })),
        projectSeries,
      ),
    [data, projectSeries],
  )
  const ethStaked = useMemo<LiquidStakingChartBackground>(() => {
    const usd = new Map(
      data?.map((point) => [point.timestamp, point.ethStakedUsd]),
    )
    return {
      key: ETH_STAKED_KEY,
      label: ETH_STAKED_TITLE,
      color: 'var(--chart-ethereum-secondary)',
      formatAxisLabel: (value) => `${formatNumber(value, 0)} ETH`,
      formatTooltipValue: formatEthStaked,
      formatTooltipSubValue: (timestamp) => {
        const value = usd.get(timestamp)
        return value != null ? formatCurrency(value, 'usd') : undefined
      },
    }
  }, [data])

  return frame({
    title: 'Rate-implied yield',
    description: [
      YIELD_METRIC.tooltip,
      'Network average is the return of active Ethereum validators before any protocol fee: consensus rewards plus what proposers earn from blocks, over their balance, for the same 30 days.',
      'The shaded area is the ETH staked.',
    ].join(' '),
    timeRange: getChartTimeRangeFromData(chartData),
    isPlaceholderData,
    children: (
      <LiquidStakingLineChart
        series={series}
        data={chartData}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        ariaLabel="Rate-implied yield"
        hiddenKeys={hiddenKeys}
        formatYAxisLabel={(value) => formatYield(value, 1)}
        formatTooltipValue={(value) => formatYield(value, 2)}
        formatTooltipDate={(timestamp) =>
          formatMetricDate(YIELD_METRIC, timestamp)
        }
        background={ethStaked}
      />
    ),
  })
}

export function CostOfExitChart({
  projectSeries,
  hiddenKeys,
  range,
  projectId,
  description,
  frame,
}: ChartProps & { description: string }) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.defi.liquidStakingCostOfExitChart,
    { range, projectId },
  )

  const chartData = useMemo<LiquidStakingChartData | undefined>(
    () =>
      withProjectValues(
        data?.map((point) => ({
          timestamp: point.timestamp,
          ...capDays(point.projects),
        })),
        projectSeries,
      ),
    [data, projectSeries],
  )
  const pointsByTimestamp = useMemo(
    () => new Map(data?.map((point) => [point.timestamp, point])),
    [data],
  )

  return frame({
    title: 'Cost of exit',
    description,
    // A point is a day, so the range runs to the end of the last one.
    timeRange: getChartTimeRangeFromData(chartData, { bucket: 'day' }),
    isPlaceholderData,
    children: (
      <LiquidStakingLineChart
        series={projectSeries}
        data={chartData}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        ariaLabel="Cost of exit"
        hiddenKeys={hiddenKeys}
        // Exits range from free to a year, which a linear axis flattens
        // into the floor. The axis always spans that, so every tick shows.
        yAxis={{
          scale: scaleSymlog,
          domain: [0, MAX_DRAWN_DAYS],
          ticks: [0, 1, 10, 100, MAX_DRAWN_DAYS],
        }}
        formatYAxisLabel={(value) =>
          value >= MAX_DRAWN_DAYS
            ? `${MAX_DRAWN_DAYS}d+`
            : `${formatNumberWithCommas(value, { maximumFractionDigits: 0 })}d`
        }
        // ~ marks a value that counts requests still queued.
        formatTooltipValue={(value, key, timestamp) => {
          const point = pointsByTimestamp.get(timestamp)
          const days = point?.projects[key] ?? value
          return `${point?.estimated.includes(key) ? '~' : ''}${formatDays(days)}`
        }}
        formatTooltipDate={(timestamp) =>
          formatMetricDate(COST_OF_EXIT_METRIC, timestamp)
        }
      />
    ),
  })
}

/** At most MAX_DRAWN_DAYS, where the axis reads 365d+. */
function capDays(
  values: Record<string, number | null>,
): Record<string, number | null> {
  return Object.fromEntries(
    Object.entries(values).map(([key, days]) => [
      key,
      days === null ? null : Math.min(days, MAX_DRAWN_DAYS),
    ]),
  )
}

/**
 * Empty when no project has a value in the range, so the chart shows its
 * no-data state instead of empty axes (the API returns a row per day anyway).
 */
function withProjectValues(
  data: LiquidStakingChartData | undefined,
  projectSeries: LiquidStakingChartSeries[],
): LiquidStakingChartData | undefined {
  if (!data) return
  const hasValue = data.some((point) =>
    projectSeries.some((series) => point[series.key] != null),
  )
  return hasValue ? data : []
}

function ChartCard({
  title,
  description,
  timeRange,
  isPlaceholderData,
  children,
}: LiquidStakingChartFrameProps) {
  return (
    <PrimaryCard>
      <ChartCardHeader
        title={title}
        subtitle={
          <Tooltip>
            <TooltipTrigger className="translate-y-px">
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
          </Tooltip>
        }
        meta={
          <ChartTimeRange
            timeRange={timeRange}
            isPlaceholderData={isPlaceholderData}
          />
        }
      />
      <div className="mt-4">{children}</div>
    </PrimaryCard>
  )
}

function ProjectLabel({ project }: { project: LiquidStakingChartProject }) {
  return (
    <span className="inline-flex items-center gap-1">
      <img
        src={project.icon}
        alt=""
        width={14}
        height={14}
        className="size-3.5 rounded-full"
      />
      {project.shortName ?? project.name}
    </span>
  )
}
