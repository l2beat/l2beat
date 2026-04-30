import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyTvlChart } from '../../summary/components/PrivacyTvlChart'
import { PrivacyChartRangeControls } from './PrivacyChartRangeControls'
import { PrivacyFlowChart } from './PrivacyFlowChart'

interface Props {
  project: ChartProject
  defaultRange: ChartRange
}

export function PrivacyChartsSection({ project, defaultRange }: Props) {
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

  const tvlChartData = useMemo(
    () =>
      data?.tvlChart.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
    [data],
  )
  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        chartData?.map((point) => ({ timestamp: point.timestamp })) ??
          tvlChartData,
      ),
    [chartData, tvlChartData],
  )

  return (
    <div className="space-y-6">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <PrivacyChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>

      <div>
        <h3 className="mb-3 font-bold text-lg md:text-xl">
          Total value locked
        </h3>
        <PrivacyTvlChart
          data={tvlChartData}
          syncedUntil={data?.tvlSyncedUntil}
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
