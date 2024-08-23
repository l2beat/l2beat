'use client'

import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'

interface Props {
  timeRange: ActivityTimeRange
  setTimeRange: (timeRange: ActivityTimeRange) => void
}

export function ActivityTimeRangeControls({ timeRange, setTimeRange }: Props) {
  return (
    <RadioGroup value={timeRange} onValueChange={setTimeRange}>
      <RadioGroupItem value="7d">7D</RadioGroupItem>
      <RadioGroupItem value="30d">30D</RadioGroupItem>
      <RadioGroupItem value="90d">90D</RadioGroupItem>
      <RadioGroupItem value="180d">180D</RadioGroupItem>
      <RadioGroupItem value="1y">1Y</RadioGroupItem>
      <RadioGroupItem value="max">MAX</RadioGroupItem>
    </RadioGroup>
  )
}
