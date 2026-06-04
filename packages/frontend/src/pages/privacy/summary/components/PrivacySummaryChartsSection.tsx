import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChartTabs } from '~/pages/scaling/summary/components/ChartTabs'
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
  const { data: flowsData, isLoading: isFlowsLoading } = useQuery(
    trpc.privacy.flowsChart.queryOptions({ projectIds, range }),
  )
  const { data: tvlData, isLoading: isTvlLoading } = useQuery(
    trpc.privacy.tvlChart.queryOptions({ projectIds, range }),
  )

  const flowChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        flowsData?.chart.map(([timestamp]) => ({ timestamp })),
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
        projects={projects}
        syncedUntil={tvlData?.syncedUntil}
        isLoading={isTvlLoading}
      />
    </div>
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
