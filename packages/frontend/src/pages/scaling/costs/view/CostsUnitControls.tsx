import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function CostsUnitControls() {
  return (
    <RadioGroup
      role="costs-unit-controls"
      name="costs-unit"
      className="w-min"
      options={[
        {
          value: 'USD',
          checked: true,
        },
        {
          value: 'ETH',
        },
        {
          value: 'GAS',
        },
      ]}
    />
  )
}
