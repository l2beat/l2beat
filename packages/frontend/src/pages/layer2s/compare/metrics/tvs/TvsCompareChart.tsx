import { formatCurrency } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useTRPC } from '~/trpc/React'
import { formatTimestamp } from '~/utils/dates'
import {
  CompareMetricLineChart,
  toCompareChartPoints,
} from '../../components/CompareMetricLineChart'
import type { CompareTvsFilter } from '../../utils/compareChartState'
import type { CompareMetricChartProps } from '../types'
import { getTvsCompareChartParams } from './tvsCompareMetric'

/** Indices into `ProjectTvsChartDataPoint` for each TVS filter. */
const TVS_FILTER_VALUE_INDEX: Record<CompareTvsFilter, number> = {
  all: 0,
  canonical: 1,
  external: 2,
  native: 3,
  ether: 4,
  stablecoin: 5,
  btc: 6,
  rwaRestricted: 7,
  rwaPublic: 8,
  other: 9,
}

export function TvsCompareChart({
  projects,
  config,
  chartRange,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.tvs.detailedChartWithProjectsRanges.queryOptions(
      getTvsCompareChartParams(projects, config, chartRange),
    ),
  )
  const unit = config.tvsUnit
  const valueIndex = TVS_FILTER_VALUE_INDEX[config.tvsFilter]

  const chartData = useMemo(
    () =>
      data &&
      toCompareChartPoints(
        data.chart,
        projects,
        ([, ethPrice, valuesByProject], projectId) => {
          const value = valuesByProject[projectId]?.[valueIndex]
          const divider = unit === 'usd' ? 1 : ethPrice
          return value !== undefined && divider !== null && divider !== 0
            ? value / divider
            : null
        },
      ),
    [data, projects, unit, valueIndex],
  )

  return (
    <CompareMetricLineChart
      projects={projects}
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
      formatYAxisLabel={(value) => formatCurrency(value, unit)}
      formatTooltipValue={(value) => formatCurrency(value, unit)}
      renderTooltipTimestamp={(label) =>
        formatTimestamp(label, {
          longMonthName: true,
          mode: 'datetime',
        })
      }
    />
  )
}
