import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChartTabs } from '~/pages/layer2s/summary/components/ChartTabs'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
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
  } = useQuery(
    trpc.privacy.flowsChart.queryOptions(
      {
        projectIds,
        range,
      },
      { placeholderData: keepPreviousData },
    ),
  )
  const {
    data: tvlData,
    isLoading: isTvlLoading,
    isPlaceholderData: isTvlPlaceholderData,
  } = useQuery(
    trpc.tvs.chartByProjects.queryOptions(
      {
        projectIds: tvlProjectIds,
        range,
      },
      { placeholderData: keepPreviousData },
    ),
  )

  const flowChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        flowsData?.chart.map(([timestamp]) => ({ timestamp })),
        { bucket: 'day' },
      ),
    [flowsData],
  )

  const tvlChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        tvlData?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [tvlData],
  )

  const countsChart = (
    <ChartShowsPreviousData value={isFlowsPlaceholderData}>
      <div>
        <div className="mb-3">
          <h2 className="font-bold text-lg md:text-xl">
            Total deposit and withdrawal counts
          </h2>
          <ChartTimeRange timeRange={flowChartTimeRange} />
        </div>
        <PrivacyFlowChart
          data={flowsData?.chart}
          syncedUntil={flowsData?.syncedUntil}
          isLoading={isFlowsLoading}
          metric={'count'}
        />
      </div>
    </ChartShowsPreviousData>
  )
  const tvlChart = (
    <ChartShowsPreviousData value={isTvlPlaceholderData}>
      <div>
        <div className="mb-3">
          <h2 className="font-bold text-lg md:text-xl">Total value locked</h2>
          <ChartTimeRange timeRange={tvlChartTimeRange} />
        </div>
        <PrivacyTvlBreakdownChart
          data={tvlData?.chart}
          projects={tvlProjects}
          syncedUntil={tvlData?.syncedUntil}
          isLoading={isTvlLoading}
        />
      </div>
    </ChartShowsPreviousData>
  )

  return (
    <>
      <div className="mb-4 grid grid-cols-2 gap-x-3 max-md:mt-2 max-lg:hidden">
        <PrimaryCard>{tvlChart}</PrimaryCard>
        <PrimaryCard>{countsChart}</PrimaryCard>
      </div>
      <ChartTabs
        className="mt-2 mb-4 lg:hidden"
        charts={[tvlChart, countsChart]}
      />
      <ChartControlsWrapper className="justify-end max-md:pr-4">
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
    </>
  )
}
