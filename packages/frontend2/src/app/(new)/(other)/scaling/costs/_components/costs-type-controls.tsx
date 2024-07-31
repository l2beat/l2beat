import React from 'react'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'

interface Props<T extends string> {
  value: T
  onValueChange: (value: T) => void
}

export function CostsTypeControls<T extends string>({ value, onValueChange }: Props<T>) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      <RadioGroupItem value="total" variant="highlighted">
        TOTAL
      </RadioGroupItem>
      <RadioGroupItem value="per-l2-tx" variant="highlighted">
        PER L2 TX
      </RadioGroupItem>
    </RadioGroup>
  )
}
