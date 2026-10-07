import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
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
  const { data: flowsData, isLoading: isFlowsLoading } = useQuery(
    trpc.privacy.flowsChart.queryOptions({
      projectIds,
      range,
    }),
  )
  const { data: tvlData, isLoading: isTvlLoading } = useQuery(
    trpc.tvs.chartByProjects.queryOptions({
      projectIds: tvlProjectIds,
      range,
    }),
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
  )
  const tvlChart = (
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
  )

  // One card, so the shared range control reads as belonging to both charts.
  return (
    <PrimaryCard>
      <div className="mb-3 grid grid-cols-2 gap-x-6 max-lg:hidden">
        {tvlChart}
        {countsChart}
      </div>
      <ChartTabs
        className="-mx-4 md:-mx-6 pb-1! lg:hidden"
        charts={[tvlChart, countsChart]}
      />
      <ChartControlsWrapper className="justify-end">
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
    </PrimaryCard>
  )
}
