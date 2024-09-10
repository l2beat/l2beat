import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { useIsClient } from '~/hooks/use-is-client'
import { type LivenessTimeRange } from '~/server/features/scaling/liveness/types'

interface Props {
  timeRange: LivenessTimeRange
  setTimeRange: (timeRange: LivenessTimeRange) => void
}

export function LivenessTimeRangeControls({ timeRange, setTimeRange }: Props) {
  const isClient = useIsClient()

  if (!isClient) {
    return <Skeleton className="h-8 w-[156px]" />
  }

  return (
    <RadioGroup value={timeRange} onValueChange={setTimeRange}>
      <RadioGroupItem value="30d">30D</RadioGroupItem>
      <RadioGroupItem value="90d">90D</RadioGroupItem>
      <RadioGroupItem value="max">MAX</RadioGroupItem>
    </RadioGroup>
  )
}
