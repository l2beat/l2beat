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
          label: 'PER L2 TX',
          value: 'PER-L2-TX',
          className: 'w-max',
        },
      ]}
    />
  )
}
