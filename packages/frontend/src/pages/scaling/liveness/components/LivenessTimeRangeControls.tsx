import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useIsClient } from '~/hooks/useIsClient'
import type { LivenessTimeRange } from '~/server/features/scaling/liveness/types'

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
      <RadioGroupItem value="30d">30D</RadioGroupItem>
      <RadioGroupItem value="90d">90D</RadioGroupItem>
      <RadioGroupItem value="max">MAX</RadioGroupItem>
    </RadioGroup>
  )
}
