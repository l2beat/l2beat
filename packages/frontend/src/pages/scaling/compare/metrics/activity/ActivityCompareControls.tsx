import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { ActivityMetricControls } from '~/pages/scaling/activity/components/ActivityMetricControls'
import type { CompareActivityUnit } from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'

export function ActivityCompareControls({
  state,
  setState,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[104px]" />
  }
  return (
    <ActivityMetricControls<CompareActivityUnit>
      value={state.activityUnit}
      onValueChange={(activityUnit) =>
        setState((prev) => ({ ...prev, activityUnit }))
      }
      projectChart
      className="h-9"
    />
  )
}
