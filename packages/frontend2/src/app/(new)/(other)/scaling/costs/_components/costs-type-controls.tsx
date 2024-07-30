import React from 'react'
import { RadioGroup, RadioGroupItem } from '~/app/_components/radio-group'

export function CostsTypeControls() {
  return (
    // <RadioGroup
    //   role="costs-type-controls"
    //   name="costs-type"
    //   className="w-min"
    //   highlighted
    //   options={[
    //     {
    //       value: 'TOTAL',
    //       checked: true,
    //     },
    //     {
    //       label: 'PER L2 TX',
    //       value: 'PER-L2-TX',
    //       className: 'w-max',
    //     },
    //   ]}
    // />
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
