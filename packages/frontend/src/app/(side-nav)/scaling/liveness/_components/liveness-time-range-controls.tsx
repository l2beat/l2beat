import type { LivenessTimeRange } from 'rewrite/src/server/features/scaling/liveness/types'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { useIsClient } from '~/hooks/use-is-client'

interface Props {
  timeRange: LivenessTimeRange~/server/features/scaling/liveness/types
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
