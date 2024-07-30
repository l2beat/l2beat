import React from 'react'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'

export function CostsTypeControls() {
  return (
    <RadioGroup defaultValue="total">
      <RadioGroupItem value="total" variant="highlighted">
        TOTAL
      </RadioGroupItem>
      <RadioGroupItem value="per-l2-tx" variant="highlighted">
        PER L2 TX
      </RadioGroupItem>
    </RadioGroup>
  )
}
