'use client'

import { useCookieState } from '~/hooks/use-cookie-state'
import { api } from '~/trpc/react'
import { TvlChart } from '../../../_components/tvl-chart'

export function BridgesTvlChart() {
  const [timeRange, setTimeRange] = useCookieState('bridgesSummaryChartRange')

  const bridgesSummaryQuery = api.bridges.summary.chart.useQuery({
    range: timeRange,
  })

  const { data } = bridgesSummaryQuery

  return (
    <TvlChart
      milestones={[]}
      data={data}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      explanation="Sum of all funds locked on Ethereum converted to"
      tag="bridges-summary"
    />
  )
}
