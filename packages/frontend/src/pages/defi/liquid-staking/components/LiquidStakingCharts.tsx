import { formatNumber } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { useTRPC } from '~/trpc/React'
import { generateAccessibleColors } from '~/utils/generateColors'
import type { ChartRange } from '~/utils/range/range'
import { formatDays, formatYield } from '../formatLiquidStaking'
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
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.defi.liquidStakingCharts.queryOptions({ range }),
  )

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

  const yieldSeries = useMemo(
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

  const yieldData = useMemo<LiquidStakingChartData | undefined>(
    () =>
      data?.yield.map((point) => ({
        timestamp: point.timestamp,
        ...point.projects,
        [NETWORK_KEY]: point.network,
        [ETH_STAKED.key]: point.ethStaked,
      })),
    [data],
  )
  const costOfExitData = useMemo<LiquidStakingChartData | undefined>(
    () =>
      data?.costOfExit.map((point) => ({
        timestamp: point.timestamp,
        ...point.projects,
      })),
    [data],
  )

  return (
    <section>
      <ChartControlsWrapper className="mb-4 justify-end">
        <ChartRangeControls
          name="liquid-staking"
          value={range}
          setValue={setRange}
          options={[
            { value: '30d', label: '30D' },
            { value: '90d', label: '90D' },
            { value: '180d', label: '180D' },
            { value: '1y', label: '1Y' },
            { value: 'max', label: 'MAX' },
          ]}
        />
      </ChartControlsWrapper>
      <div className="grid gap-x-6 gap-y-8 lg:grid-cols-2">
        <ChartBlock
          title="Rate-implied yield"
          info={[
            "What a holder earned, net of protocol fees: the annualised change of each token's exchange rate over the previous 30 days.",
            'Network average is the return of all Ethereum validators before any protocol fee: consensus issuance plus MEV-boost payments and tips, over the active stake, for the same 30 days.',
            'The shaded area is the ETH staked network-wide (right axis): rewards per validator shrink as the square root of the total stake, so the yield falls as the stake grows.',
          ].join(' ')}
          timeRange={getChartTimeRangeFromData(yieldData)}
        >
          <LiquidStakingLineChart
            series={yieldSeries}
            data={yieldData}
            isLoading={isLoading}
            formatYAxisLabel={(value) => formatYield(value, 1)}
            formatTooltipValue={(value) => formatYield(value, 2)}
            background={ETH_STAKED}
          />
        </ChartBlock>
        <ChartBlock
          title="Cost of exit"
          info={[
            'How many days of staking yield a holder gives up to exit, by the cheaper route: waiting for a protocol withdrawal, which earns nothing while queued, or selling at the market discount.',
            'The discount is a 7-day median of market prices. For wBETH the wait is the operator-set lock time.',
          ].join(' ')}
          timeRange={getChartTimeRangeFromData(costOfExitData)}
        >
          <LiquidStakingLineChart
            series={projectSeries}
            data={costOfExitData}
            isLoading={isLoading}
            formatYAxisLabel={(value) => `${value.toFixed(0)}d`}
            formatTooltipValue={formatDays}
          />
        </ChartBlock>
      </div>
    </section>
  )
}

function ChartBlock({
  title,
  info,
  timeRange,
  children,
}: {
  title: string
  /** What the chart measures and where the data comes from. */
  info: string
  timeRange: [number, number] | undefined
  children: ReactNode
}) {
  // Heading and chart sit on rows shared with the neighbouring block, so the
  // two charts of a row line up whatever the length of their headings.
  return (
    <div className="row-span-2 grid grid-cols-1 grid-rows-subgrid gap-y-0">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg md:text-xl">{title}</h2>
          <Tooltip>
            <TooltipTrigger>
              <InfoIcon className="size-3.5 fill-blue-700" />
            </TooltipTrigger>
            <TooltipContent>{info}</TooltipContent>
          </Tooltip>
        </div>
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <div>{children}</div>
    </div>
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
