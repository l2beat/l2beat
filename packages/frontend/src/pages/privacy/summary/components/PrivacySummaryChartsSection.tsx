import { useMemo, useState } from 'react'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { PrivacyFlowsChartRangeControls } from '../../project/components/PrivacyFlowsChartRangeControls'
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

  const tvsChartData = useMemo(
    () =>
      data?.tvsChart.map(([timestamp, value]) => ({
        timestamp,
        value,
      })),
    [data],
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
        tvsChartData?.map((point) => ({ timestamp: point.timestamp })),
      ),
    [tvsChartData],
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
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
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
      <PrivacyTvsChart
        data={tvsChartData}
        syncedUntil={data?.tvsSyncedUntil}
        isLoading={isLoading}
      />
    </div>
  )

  return (
    <>
      <div className="mb-3">
        <div className="grid grid-cols-2 gap-x-3">
          <PrimaryCard>{tvsChart}</PrimaryCard>
          <PrimaryCard>{countsChart}</PrimaryCard>
        </div>
      </div>
      <ChartControlsWrapper className="justify-end">
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
    </>
  )
}
