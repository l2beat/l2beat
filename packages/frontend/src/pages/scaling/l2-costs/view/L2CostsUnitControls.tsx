import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function L2CostsUnitControls() {
  return (
    <RadioGroup
      role="l2-costs-unit-controls"
      name="l2-costs-unit"
      className="w-min"
      options={[
        {
          value: 'ETH',
          checked: true,
        },
        {
          value: 'GAS',
        },
        {
          value: 'USD',
        },
      ]}
    />
  )
}
