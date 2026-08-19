import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import type { CompareActivityUnit } from '../../utils/compareChartState'
import type { CompareMetricControlsProps } from '../types'

export function ActivityCompareControls({
  config,
  setConfig,
}: CompareMetricControlsProps) {
  const isClient = useIsClient()
  if (!isClient) {
    return <Skeleton className="h-9 w-[104px]" />
  }
  return (
    <ActivityMetricControls<CompareActivityUnit>
      value={config.activityUnit}
      onValueChange={(activityUnit) =>
        setConfig((prev) => ({ ...prev, activityUnit }))
      }
      projectChart
      className="h-9"
    />
  )
}
