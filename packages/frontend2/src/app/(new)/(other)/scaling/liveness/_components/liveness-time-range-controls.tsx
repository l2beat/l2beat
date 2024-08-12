import React from 'react'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { type LivenessTimeRange } from '~/server/features/liveness/types'

interface Props {
  timeRange: LivenessTimeRange
  setTimeRange: (timeRange: LivenessTimeRange) => void
}

export function LivenessTimeRangeControls({ timeRange, setTimeRange }: Props) {
  return (
    <RadioGroup value={timeRange} onValueChange={setTimeRange}>
      <RadioGroupItem value="30d">30D</RadioGroupItem>
      <RadioGroupItem value="90d">90D</RadioGroupItem>
      <RadioGroupItem value="max">MAX</RadioGroupItem>
    </RadioGroup>
  )
}
