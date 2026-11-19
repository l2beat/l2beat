import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
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
