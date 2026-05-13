import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyTvsChart } from '../../summary/components/PrivacyTvsChart'
import { PrivacyFlowsChartRangeControls } from './PrivacyFlowsChartRangeControls'
import { PrivacyFlowChart } from './PrivacyFlowChart'

interface Props {
  project: ChartProject
  defaultRange: ChartRange
}

export function PrivacyFlowsChartsSection({ project, defaultRange }: Props) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = api.privacy.projectChart.useQuery({
    projectId: project.id,
    range,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(
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
    [data],
  )

  const tvsChartData = useMemo(
    () =>
      data?.tvsChart.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
    [data],
  )
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        chartData?.map((point) => ({ timestamp: point.timestamp })) ??
          tvsChartData,
      ),
    [chartData, tvsChartData],
  )

  return (
    <div className="space-y-6">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>

      <div>
        <h3 className="mb-3 font-bold text-lg md:text-xl">
          Total value secured
        </h3>
        <PrivacyTvsChart
          data={tvsChartData}
          syncedUntil={data?.tvsSyncedUntil}
          isLoading={isLoading}
        />
      </div>

      <div>
        <h3 className="mb-3 font-bold text-lg md:text-xl">
          Total deposit and withdrawal counts
        </h3>
        <PrivacyFlowChart
          data={chartData}
          syncedUntil={data?.syncedUntil}
          isLoading={isLoading}
          metric="count"
          project={project}
        />
      </div>

      <div>
        <h3 className="mb-3 font-bold text-lg md:text-xl">
          Deposited and withdrawn value
        </h3>
        <PrivacyFlowChart
          data={chartData}
          syncedUntil={data?.syncedUntil}
          isLoading={isLoading}
          metric="value"
          project={project}
        />
      </div>
    </div>
  )
}
