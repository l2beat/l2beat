import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ChartTabs } from '~/pages/scaling/summary/components/ChartTabs'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyFlowChart } from '../../project/components/PrivacyFlowChart'
import { PrivacyFlowsChartRangeControls } from '../../project/components/PrivacyFlowsChartRangeControls'
import type { PrivacyTvsBreakdownProject } from './PrivacyTvsBreakdownChart'
import { PrivacyTvsBreakdownChart } from './PrivacyTvsBreakdownChart'

interface Props {
  projects: PrivacyTvsBreakdownProject[]
  defaultRange: ChartRange
}

export function PrivacySummaryChartsSection({ projects, defaultRange }: Props) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const projectIds = useMemo(() => projects.map((p) => p.id), [projects])
  const { data: flowsData, isLoading: isFlowsLoading } =
    api.privacy.flowsChart.useQuery({ projectIds, range })
  const { data: tvsData, isLoading: isTvsLoading } =
    api.privacy.tvsChart.useQuery({ projectIds, range })

  const chartData = useMemo(
    () =>
      flowsData?.chart.map(
        ([
          timestamp,
          depositsCount,
          withdrawalsCount,
          depositsValueUsd,
          withdrawalsValueUsd,
        ]) => ({
          timestamp,
          depositsCount,
          withdrawalsCount,
          depositsValueUsd,
          withdrawalsValueUsd,
        }),
      ),
    [flowsData],
  )

  const flowChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        chartData?.map((point) => ({ timestamp: point.timestamp })),
      ),
    [chartData],
  )

  const tvsChartTimeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        tvsData?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [tvsData],
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
        data={chartData}
        syncedUntil={flowsData?.syncedUntil}
        isLoading={isFlowsLoading}
        metric={'count'}
      />
    </div>
  )
  const tvsChart = (
    <div>
      <div className="mb-3">
        <h2 className="font-bold text-lg md:text-xl">Total value secured</h2>
        <ChartTimeRange timeRange={tvsChartTimeRange} />
      </div>
      <PrivacyTvsBreakdownChart
        data={tvsData?.chart}
        projects={projects}
        syncedUntil={tvsData?.syncedUntil}
        isLoading={isTvsLoading}
      />
    </div>
  )

  return (
    <>
      <div className="mb-3 grid grid-cols-2 gap-x-3 max-md:mt-2 max-lg:hidden">
        <PrimaryCard>{tvsChart}</PrimaryCard>
        <PrimaryCard>{countsChart}</PrimaryCard>
      </div>
      <ChartTabs
        className="mt-2 mb-3 lg:hidden"
        charts={[tvsChart, countsChart]}
      />
      <ChartControlsWrapper className="justify-end max-md:pr-4">
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
    </>
  )
}
