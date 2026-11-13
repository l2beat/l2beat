import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import type { LivenessTimeRange } from '~/server/features/layer2s/liveness/types'

interface Props {
  timeRange: LivenessTimeRange
  setTimeRange: (timeRange: LivenessTimeRange) => void
  className?: string
}

export function LivenessTimeRangeControls({
  timeRange,
  setTimeRange,
  className,
}: Props) {
  const isClient = useIsClient()

  if (!isClient) {
    return <Skeleton className="h-8 w-[156px]" />
  }

  return (
    <RadioGroup
      name="livenessTimeRange"
      value={timeRange}
      onValueChange={setTimeRange}
      className={className}
    >
      <RadioGroupItem value="30d">30d</RadioGroupItem>
      <RadioGroupItem value="90d">90d</RadioGroupItem>
      <RadioGroupItem value="max">Max</RadioGroupItem>
    </RadioGroup>
  )
}
