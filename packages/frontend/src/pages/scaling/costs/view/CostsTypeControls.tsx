import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function CostsTypeControls() {
  return (
    <RadioGroup
      role="costs-type-controls"
      name="costs-type"
      className="w-min"
      highlighted
      options={[
        {
          value: 'TOTAL',
          checked: true,
        },
        {
          value: 'AMORTIZED',
        },
      ]}
    />
  )
}
