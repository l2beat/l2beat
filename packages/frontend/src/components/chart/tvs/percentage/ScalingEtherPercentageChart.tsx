import { useMemo } from 'react'
import type { TvsProjectFilter } from '~/server/features/scaling/tvs/utils/projectFilterUtils'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/React'
import { EtherPercentageChart } from './EtherPercentageChart'

interface Props {
  filter: TvsProjectFilter
  range: TvsChartRange
}

export function ScalingEtherPercentageChart({ filter, range }: Props) {
  const { data, isLoading } = api.tvs.etherAndStablecoinsCharts.useQuery({
    range,
    filter,
  })

  const chartData: [number, Record<string, number>][] | undefined =
    useMemo(() => {
      return data?.chart.map(([timestamp, __, etherValues]) => {
        return [timestamp, etherValues]
      })
    }, [data])

  return (
    <EtherPercentageChart
      data={chartData}
      isLoading={isLoading}
      syncedUntil={data?.syncedUntil}
    />
  )
}
