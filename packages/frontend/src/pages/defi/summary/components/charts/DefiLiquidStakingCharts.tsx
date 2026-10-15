import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import type {
  DefiLiquidStakingChartProject,
  DefiLiquidStakingCharts as DefiLiquidStakingChartsData,
} from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import {
  formatDays,
  getExitCost,
  getLiquidStakingSeries,
  withoutIncompleteTail,
} from '~/server/features/defi/liquidStakingCharts/liquidStakingMetrics'
import { generateAccessibleColors } from '~/utils/generateColors'
import { LiquidStakingLineChart } from './LiquidStakingLineChart'

export function DefiLiquidStakingCharts({
  charts,
}: {
  charts: DefiLiquidStakingChartsData
}) {
  const colors = useMemo(() => {
    const protocols = charts.projects.filter((project) => !project.benchmark)
    const palette = generateAccessibleColors(protocols.length)
    return Object.fromEntries(
      charts.projects.map((project) => [
        project.id,
        project.benchmark
          ? 'var(--chart-ethereum)'
          : (palette[protocols.indexOf(project)] ?? 'var(--secondary)'),
      ]),
    )
  }, [charts.projects])

  const apr = getLiquidStakingSeries(charts, 'apr30')
  const premium = getLiquidStakingSeries(charts, 'premium')
  const exitDays = getLiquidStakingSeries(charts, 'exitDays')
  const exitCost = getExitCost(exitDays, premium, apr)
  // The newest day can lack the network average, published a day later.
  const aprCharted = withoutIncompleteTail(apr)
  const timeRange = getChartTimeRangeFromData(aprCharted.data)

  const benchmarkCharted = apr.projects.some((project) => project.benchmark)
  const stake = charts.stake && {
    key: 'stake',
    label: 'ETH staked',
    values: charts.stake,
    color: 'var(--chart-ethereum-secondary)',
    formatAxisLabel: (value: number) => `${value.toFixed(0)}M`,
    formatTooltipValue: (value: number) => `${value.toFixed(1)}M ETH`,
  }

  return (
    <div className="grid gap-x-6 gap-y-8 lg:grid-cols-2">
      <ChartBlock
        title="Rate-implied yield"
        info={[
          "What a holder earned, net of protocol fees: the annualised change of each token's exchange rate over the previous 30 days.",
          benchmarkCharted &&
            'Network average is the return of all Ethereum validators before any protocol fee: consensus issuance plus MEV-boost payments and tips, over the active stake, for the same 30 days.',
          stake &&
            'The shaded area is the ETH staked network-wide (right axis): rewards per validator shrink as the square root of the total stake, so the yield falls as the stake grows.',
        ]
          .filter(Boolean)
          .join(' ')}
        timeRange={timeRange}
      >
        <LiquidStakingLineChart
          projects={aprCharted.projects}
          colors={colors}
          data={aprCharted.data}
          formatYAxisLabel={(value) => formatPercent(value, 1)}
          formatTooltipValue={(value) => formatPercent(value, 2)}
          background={stake}
        />
      </ChartBlock>
      <ChartBlock
        title="Cost of exit"
        info={[
          'How many days of staking yield a holder gives up to exit, by the cheaper route: waiting for a protocol withdrawal, which earns nothing while queued, or selling at the market discount.',
          'The discount is a 7-day median of quoted prices, before swap fees and price impact. For wBETH the wait is the operator-set lock time.',
        ]
          .filter(Boolean)
          .join(' ')}
        timeRange={getChartTimeRangeFromData(exitCost.data)}
      >
        <LiquidStakingLineChart
          projects={exitCost.projects}
          colors={colors}
          data={exitCost.data}
          formatYAxisLabel={(value) => `${value.toFixed(0)}d`}
          formatTooltipValue={(value) => formatDays(value)}
        />
      </ChartBlock>
    </div>
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

function formatPercent(value: number, decimals: number) {
  return `${(value * 100).toFixed(decimals)}%`
}

export type { DefiLiquidStakingChartProject }
