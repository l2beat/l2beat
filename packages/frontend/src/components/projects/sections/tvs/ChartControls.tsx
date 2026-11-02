import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { ChartShowsPreviousData } from '~/components/core/chart/ChartPreviousData'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useL2RwaRestrictedTokensContext } from '~/pages/layer2s/components/L2RwaRestrictedTokensContext'
import { useTRPC } from '~/trpc/React'

export function ChartControls({ projectId }: { projectId: string }) {
  const trpc = useTRPC()
  const { range, unit, setUnit, setRange } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useL2RwaRestrictedTokensContext()
  const { data, isPlaceholderData } = useQuery(
    trpc.tvs.detailedChart.queryOptions(
      {
        filter: { type: 'projects', projectIds: [projectId] },
        range,
        excludeAssociatedTokens: false,
        excludeRwaRestrictedTokens,
      },
      { placeholderData: keepPreviousData },
    ),
  )

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [data?.chart],
  )
  return (
    <ChartShowsPreviousData value={isPlaceholderData}>
      <TvsChartControls
        timeRange={timeRange}
        range={{
          value: range,
          setValue: setRange,
        }}
        unit={{
          value: unit,
          setValue: setUnit,
        }}
      />
    </ChartShowsPreviousData>
  )
}
