import { formatCurrency, formatInteger } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { ChartCardHeader } from '~/components/chart/ChartCardHeader'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { rangeToOption } from '~/components/core/chart/utils/rangeToOption'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChartTabs } from '~/pages/layer2s/summary/components/ChartTabs'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { PrivacyFlowChart } from '../../project/components/PrivacyFlowChart'
import { PrivacyFlowsChartRangeControls } from '../../project/components/PrivacyFlowsChartRangeControls'
import type { PrivacyTvlBreakdownProject } from './PrivacyTvlBreakdownChart'
import { PrivacyTvlBreakdownChart } from './PrivacyTvlBreakdownChart'

interface Props {
  projects: PrivacyTvlBreakdownProject[]
  defaultRange: ChartRange
}

export function PrivacySummaryChartsSection({ projects, defaultRange }: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const projectIds = useMemo(() => projects.map((p) => p.id).sort(), [projects])
  const tvlProjects = useMemo(
    () => projects.filter((p) => p.hasTvl),
    [projects],
  )
  const tvlProjectIds = useMemo(
    () => tvlProjects.map((p) => p.id).sort(),
    [tvlProjects],
  )
  const {
    data: flowsData,
    isLoading: isFlowsLoading,
    isPlaceholderData: isFlowsPlaceholderData,
    shownInput: flowsShownInput,
  } = useChartQuery(trpc.privacy.flowsChart, {
    projectIds,
    range,
  })
  const flowsResolution = rangeToResolution(flowsShownInput.range)
  const {
    data: tvlData,
    isLoading: isTvlLoading,
    isPlaceholderData: isTvlPlaceholderData,
    shownInput: tvlShownInput,
  } = useChartQuery(trpc.tvs.chartByProjects, {
    projectIds: tvlProjectIds,
    range,
  })

  const flowChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        flowsData?.chart.map(([timestamp]) => ({ timestamp })),
        { bucket: flowsResolution },
      ),
    [flowsData, flowsResolution],
  )

  const tvlChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        tvlData?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [tvlData],
  )

  const tvlStats = useMemo(() => getTvlStats(tvlData?.chart), [tvlData])
  const flowsTotal = useMemo(() => getFlowsTotal(flowsData?.chart), [flowsData])

  const countsChart = (
    <div className="flex flex-col gap-4">
      <ChartCardHeader
        title="Deposits and withdrawals"
        value={flowsTotal !== undefined ? formatInteger(flowsTotal) : undefined}
        valueLabel={getRangeLabels(flowsShownInput.range).past}
        isLoading={flowsTotal === undefined}
        isPlaceholderData={isFlowsPlaceholderData}
        meta={
          <ChartTimeRange
            isPlaceholderData={isFlowsPlaceholderData}
            timeRange={flowChartTimeRange}
          />
        }
      />
      <PrivacyFlowChart
        isPlaceholderData={isFlowsPlaceholderData}
        data={flowsData?.chart}
        syncedUntil={flowsData?.syncedUntil}
        isLoading={isFlowsLoading}
        metric={'count'}
        resolution={flowsResolution}
      />
    </div>
  )
  const tvlChart = (
    <div className="flex flex-col gap-4">
      <ChartCardHeader
        title="Value locked"
        value={
          tvlStats !== undefined
            ? formatCurrency(tvlStats.total, 'usd')
            : undefined
        }
        change={tvlStats?.change}
        rangeLabel={getRangeLabels(tvlShownInput.range).change}
        isLoading={tvlStats === undefined}
        isPlaceholderData={isTvlPlaceholderData}
        meta={
          <ChartTimeRange
            isPlaceholderData={isTvlPlaceholderData}
            timeRange={tvlChartTimeRange}
          />
        }
      />
      <PrivacyTvlBreakdownChart
        isPlaceholderData={isTvlPlaceholderData}
        resolution={rangeToResolution(tvlShownInput.range)}
        data={tvlData?.chart}
        projects={tvlProjects}
        syncedUntil={tvlData?.syncedUntil}
        isLoading={isTvlLoading}
      />
    </div>
  )

  return (
    <>
      {/* One range drives both charts, so it leads them. */}
      <ChartControlsWrapper className="mb-4 justify-end max-md:mt-3 max-md:px-4">
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <div className="grid grid-cols-2 gap-4 max-lg:hidden">
        <PrimaryCard>{tvlChart}</PrimaryCard>
        <PrimaryCard>{countsChart}</PrimaryCard>
      </div>
      <ChartTabs className="lg:hidden" charts={[tvlChart, countsChart]} />
    </>
  )
}

/** How the headline figures name the range, e.g. "1y" and "past 1y". */
function getRangeLabels(range: ChartRange) {
  const option = rangeToOption(range, ['7d', '30d', '90d', '1y'])
  if (option === 'max') return { change: 'all time', past: 'all time' }
  if (option !== 'custom') return { change: option, past: `past ${option}` }
  const days = rangeToDays(range)
  return { change: `${days}d`, past: `over ${days}d` }
}

/** The latest total across projects, and its change since the range's first point. */
function getTvlStats(
  chart: [number, Record<string, number | null>][] | undefined,
) {
  const sumRow = (values: Record<string, number | null>) =>
    Object.values(values).reduce<number>((sum, value) => sum + (value ?? 0), 0)
  const first = chart?.find(([, values]) =>
    Object.values(values).some((value) => value !== null),
  )
  const last = chart?.findLast(([, values]) =>
    Object.values(values).some((value) => value !== null),
  )
  if (!first || !last) return undefined
  const start = sumRow(first[1])
  const total = sumRow(last[1])
  return { total, change: start > 0 ? total / start - 1 : undefined }
}

/** Deposits plus withdrawals over the range. */
function getFlowsTotal(
  chart: [number, number | null, number | null, ...unknown[]][] | undefined,
) {
  if (!chart || chart.length === 0) return undefined
  return chart.reduce(
    (sum, [, deposits, withdrawals]) =>
      sum + (deposits ?? 0) + (withdrawals ?? 0),
    0,
  )
}
