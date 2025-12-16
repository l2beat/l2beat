import { useMemo } from 'react'
import { TvsChartControls } from '~/components/chart/tvs/TvsChartControls'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import { api } from '~/trpc/React'

export function ChartControls({ projectId }: { projectId: string }) {
  const { range, unit, setUnit, setRange } = useTvsChartControlsContext()
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { data } = api.tvs.detailedChart.useQuery({
    filter: { type: 'projects', projectIds: [projectId] },
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens: !includeRwaRestrictedTokens,
  })

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
