import { formatNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import {
  ChartRangeControls,
  type ChartRangeOptionValue,
} from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { InfoIcon } from '~/icons/Info'
import { useTRPC } from '~/trpc/React'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'
import { formatDays, formatYield } from '../formatLiquidStaking'
import { COST_OF_EXIT_METRIC, YIELD_METRIC } from '../liquidStakingMetrics'
import {
  type LiquidStakingChartBackground,
  type LiquidStakingChartData,
  type LiquidStakingChartSeries,
  LiquidStakingLineChart,
} from './LiquidStakingLineChart'

export interface LiquidStakingChartProject {
  id: string
  name: string
  icon: string
}

const NETWORK_KEY = 'network'

const RANGE_OPTIONS: { value: ChartRangeOptionValue; label: string }[] = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '180d', label: '180D' },
  { value: '1y', label: '1Y' },
  { value: 'max', label: 'MAX' },
]

const ETH_STAKED: LiquidStakingChartBackground = {
  key: 'ethStaked',
  label: 'ETH staked',
  color: 'var(--chart-ethereum-secondary)',
  formatAxisLabel: (value) => formatNumber(value),
  formatTooltipValue: (value) => `${formatNumber(value)} ETH`,
}

export function LiquidStakingCharts({
  projects,
  defaultRange,
}: {
  projects: LiquidStakingChartProject[]
  defaultRange: ChartRange
}) {
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
    <div className="grid gap-4 md:mt-4 lg:grid-cols-2">
      <YieldChart projectSeries={projectSeries} defaultRange={defaultRange} />
      <CostOfExitChart
        projectSeries={projectSeries}
        defaultRange={defaultRange}
      />
    </div>
  )
}

interface ChartProps {
  projectSeries: LiquidStakingChartSeries[]
  defaultRange: ChartRange
}

function YieldChart({ projectSeries, defaultRange }: ChartProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.defi.liquidStakingYieldChart.queryOptions({ range }),
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

  return (
    <ChartCard
      name="liquid-staking-yield"
      title="Rate-implied yield"
      info={[
        YIELD_METRIC.tooltip,
        'Network average is the return of active Ethereum validators before any protocol fee: consensus rewards plus what proposers earn from blocks, over their balance, for the same 30 days. Validators waiting to enter, or exited and not yet withdrawn, earn nothing and are left out.',
        'The shaded area is the ETH held by active validators (right axis): rewards per validator shrink as the square root of the total stake, so the yield falls as the stake grows.',
      ].join(' ')}
      range={range}
      setRange={setRange}
      timeRange={getChartTimeRangeFromData(chartData)}
    >
      <LiquidStakingLineChart
        series={series}
        data={chartData}
        isLoading={isLoading}
        formatYAxisLabel={(value) => formatYield(value, 1)}
        formatTooltipValue={(value) => formatYield(value, 2)}
        background={ETH_STAKED}
      />
    </ChartCard>
  )
}

function CostOfExitChart({ projectSeries, defaultRange }: ChartProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.defi.liquidStakingCostOfExitChart.queryOptions({ range }),
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
    () =>
      new Set(
        data?.flatMap((point) =>
          point.estimated.map((id) => `${point.timestamp}:${id}`),
        ),
      ),
    [data],
  )

  return (
    <ChartCard
      name="liquid-staking-cost-of-exit"
      title="Cost of exit"
      info={[
        COST_OF_EXIT_METRIC.tooltip,
        "The discount is the day's median of hourly quotes for selling 100 tokens on the deepest pools. An instant exit counts on days it could pay out 100 ETH. wBETH unwraps wait for Binance to allocate ETH, and at least the operator-set lock time; its pools are too thin to quote.",
      ].join(' ')}
      range={range}
      setRange={setRange}
      timeRange={getChartTimeRangeFromData(chartData)}
    >
      <LiquidStakingLineChart
        series={projectSeries}
        data={chartData}
        isLoading={isLoading}
        formatYAxisLabel={(value) => `${value.toFixed(0)}d`}
        formatTooltipValue={formatDays}
        isEstimated={(timestamp, key) => estimated.has(`${timestamp}:${key}`)}
      />
    </ChartCard>
  )
}

function ChartCard({
  name,
  title,
  info,
  range,
  setRange,
  timeRange,
  children,
}: {
  name: string
  title: string
  /** What the chart measures and where the data comes from. */
  info: string
  range: ChartRange
  setRange: (range: ChartRange) => void
  timeRange: [number, number] | undefined
  children: ReactNode
}) {
  // The date range changes width with the range and while loading, so it gets
  // a line of its own at a fixed height; otherwise it would decide whether the
  // controls wrap, and the card would change height on every switch. Whether
  // the controls sit beside the title follows the card's width, not its title,
  // so both cards always match. Phones show the controls as a compact select.
  return (
    <PrimaryCard className="@container">
      <ChartControlsWrapper className="items-center md:@max-lg:flex-col md:@max-lg:items-start">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg md:text-xl">{title}</h2>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        </div>
        <ChartRangeControls
          name={name}
          value={range}
          setValue={setRange}
          options={RANGE_OPTIONS}
        />
      </ChartControlsWrapper>
      <div className="mt-1 mb-4 flex h-5 items-center lg:h-6">
        <ChartTimeRange timeRange={timeRange} />
      </div>
      {children}
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
      {project.name}
    </span>
  )
}
