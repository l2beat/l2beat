import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useLayer2sRwaRestrictedTokensContext } from '~/pages/layer2s/components/Layer2sRwaRestrictedTokensContext'
import { useTRPC } from '~/trpc/React'

export function ChartControls({ projectId }: { projectId: string }) {
  const trpc = useTRPC()
  const { range, unit, setUnit, setRange } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useLayer2sRwaRestrictedTokensContext()
  const { data } = useQuery(
    trpc.tvs.detailedChart.queryOptions({
      filter: { type: 'projects', projectIds: [projectId] },
      range,
      excludeAssociatedTokens: false,
      excludeRwaRestrictedTokens,
    }),
  )

  const timeRange = useMemo(
    () =>
      getChartTimeRangeFromData(
        data?.chart.map(([timestamp]) => ({ timestamp })),
      ),
    [data?.chart],
  )
  return (
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
  )
}
