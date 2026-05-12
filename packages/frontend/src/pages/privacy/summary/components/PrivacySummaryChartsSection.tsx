import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyChartRangeControls } from '../../project/components/PrivacyChartRangeControls'
import { PrivacyFlowChart } from '../../project/components/PrivacyFlowChart'
import { PrivacyTvsChart } from './PrivacyTvsChart'

interface Props {
  defaultRange: ChartRange
}

export function PrivacySummaryChartsSection({ defaultRange }: Props) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = api.privacy.summaryChart.useQuery({
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

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )
  const tvsChartData = useMemo(
    () =>
      data?.tvsChart.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
    [data],
  )

  const countsChart = (
    <PrivacySummaryChartCard
      title="Total deposit and withdrawal counts"
      data={chartData}
      syncedUntil={data?.syncedUntil}
      isLoading={isLoading}
      metric="count"
    />
  )
  const tvsChart = (
    <div>
      <h2 className="mb-3 font-bold text-lg md:text-xl">Total value secured</h2>
      <PrivacyTvsChart
        data={tvsChartData}
        syncedUntil={data?.tvsSyncedUntil}
        isLoading={isLoading}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <PrivacyChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>

      <div className="grid grid-cols-2 gap-4 max-lg:hidden">
        <PrimaryCard>{tvsChart}</PrimaryCard>
        <PrimaryCard>{countsChart}</PrimaryCard>
      </div>

      <div className="space-y-4 lg:hidden">
        <PrimaryCard>{tvsChart}</PrimaryCard>
        <PrimaryCard>{countsChart}</PrimaryCard>
      </div>
    </div>
  )
}

interface PrivacySummaryChartCardProps {
  title: string
  data:
    | {
        timestamp: number
        depositsCount: number
        withdrawalsCount: number
        depositsValueUsd: number
        withdrawalsValueUsd: number
      }[]
    | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  metric: 'count' | 'value'
}

function PrivacySummaryChartCard({
  title,
  data,
  syncedUntil,
  isLoading,
  metric,
}: PrivacySummaryChartCardProps) {
  return (
    <div>
      <h2 className="mb-3 font-bold text-lg md:text-xl">{title}</h2>
      <PrivacyFlowChart
        data={data}
        syncedUntil={syncedUntil}
        isLoading={isLoading}
        metric={metric}
      />
    </div>
  )
}
