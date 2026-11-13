import { formatNumber } from '@l2beat/shared-pure'
import { type ReactNode, useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import {
  ChartRangeControls,
  type ChartRangeOptionValue,
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
import { useTRPC } from '~/trpc/React'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'
import { INSTANT_NOTE, MARKET_NOTE } from '../costOfExitDescription'
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

export type LiquidStakingChartProject = Pick<
  LiquidStakingEntry,
  'id' | 'name' | 'shortName' | 'icon'
>

const NETWORK_KEY = 'network'

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

const ETH_STAKED: LiquidStakingChartBackground = {
  key: 'ethStaked',
  label: ETH_STAKED_TITLE,
  color: 'var(--chart-ethereum-secondary)',
  formatAxisLabel: (value) => formatNumber(value),
  formatTooltipValue: formatEthStaked,
}

export function LiquidStakingCharts({
  projects,
  defaultRange,
}: {
  projects: LiquidStakingChartProject[]
  defaultRange: ChartRange
}) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const projectSeries = useMemo(() => {
    const colors = generateAccessibleColors(projects.length)
    return projects.map(
      (project, i): LiquidStakingChartSeries => ({
        key: project.id,
        label: <ProjectLabel project={project} />,
        color: colors[i] ?? 'var(--secondary)',
      }),
    )
  }, [projects])

  return (
    <>
      <div className="grid gap-4 md:mt-4 lg:grid-cols-2">
        <YieldChart
          projectSeries={projectSeries}
          range={range}
          frame={ChartCard}
        />
        <CostOfExitChart
          projectSeries={projectSeries}
          range={range}
          frame={ChartCard}
        />
      </div>
      <ChartControlsWrapper className="mt-4 justify-end max-md:pr-4">
        <ChartRangeControls
          name="liquid-staking"
          value={range}
          setValue={setRange}
          options={LIQUID_STAKING_RANGE_OPTIONS}
        />
      </ChartControlsWrapper>
    </>
  )
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
  range: ChartRange
  /** Only this project's line, for its own page. */
  projectId?: string
  /** Lays out the title, description and time range around the chart. */
  frame: (props: LiquidStakingChartFrameProps) => ReactNode
}

export function YieldChart({
  projectSeries,
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
      data?.map((point) => ({
        timestamp: point.timestamp,
        ...point.projects,
        [NETWORK_KEY]: point.network,
        [ETH_STAKED.key]: point.ethStaked,
      })),
    [data],
  )

  return frame({
    title: 'Rate-implied yield',
    description: [
      YIELD_METRIC.tooltip,
      'Network average is the return of active Ethereum validators before any protocol fee: consensus rewards plus what proposers earn from blocks, over their balance, for the same 30 days. Validators waiting to enter, or exited and not yet withdrawn, earn nothing and are left out.',
      'The shaded area is the ETH held by active validators (right axis): rewards per validator shrink as the square root of the total stake, so the yield falls as the stake grows.',
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
        formatYAxisLabel={(value) => formatYield(value, 1)}
        formatTooltipValue={(value) => formatYield(value, 2)}
        formatTooltipDate={(timestamp) =>
          formatMetricDate(YIELD_METRIC, timestamp)
        }
        background={ETH_STAKED}
      />
    ),
  })
}

export function CostOfExitChart({
  projectSeries,
  range,
  projectId,
  description,
  frame,
}: ChartProps & {
  /** One protocol's routes, in place of every protocol's. */
  description?: string
}) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.defi.liquidStakingCostOfExitChart,
    { range, projectId },
  )

  const chartData = useMemo<LiquidStakingChartData | undefined>(
    () =>
      data?.map((point) => ({
        timestamp: point.timestamp,
        ...point.projects,
      })),
    [data],
  )
  const estimated = useMemo(
    () => new Map(data?.map((point) => [point.timestamp, point.estimated])),
    [data],
  )

  return frame({
    title: 'Cost of exit',
    description:
      description ??
      [
        COST_OF_EXIT_METRIC.tooltip,
        MARKET_NOTE,
        INSTANT_NOTE,
        'wBETH unwraps wait for Binance to allocate ETH, and at least the operator-set lock time; its pools are too thin to quote.',
      ].join(' '),
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
        formatYAxisLabel={(value) => `${value.toFixed(0)}d`}
        // ~ marks a value that counts requests still queued.
        formatTooltipValue={(value, key, timestamp) =>
          `${estimated.get(timestamp)?.includes(key) ? '~' : ''}${formatDays(value)}`
        }
        formatTooltipDate={(timestamp) =>
          formatMetricDate(COST_OF_EXIT_METRIC, timestamp)
        }
      />
    ),
  })
}

function ChartCard({
  title,
  description,
  timeRange,
  isPlaceholderData,
  children,
}: LiquidStakingChartFrameProps) {
  // The date range changes width with the range and while loading, so its
  // line has a fixed height to keep both cards the same size.
  return (
    <PrimaryCard>
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-lg md:text-xl">{title}</h2>
        <Tooltip>
          <TooltipTrigger>
            <InfoIcon className="size-3.5" />
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      </div>
      <div className="mt-1 mb-4 flex h-5 items-center lg:h-6">
        <ChartTimeRange
          timeRange={timeRange}
          isPlaceholderData={isPlaceholderData}
        />
      </div>
      {children}
    </PrimaryCard>
  )
}

export function ProjectLabel({
  project,
}: {
  project: LiquidStakingChartProject
}) {
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
