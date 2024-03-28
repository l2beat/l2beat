import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function CostsTimeRangeControls() {
  return (
    <RadioGroup
      role="costs-time-range-controls"
      name="costs-time-range"
      className="w-min"
      options={[
        {
          value: '24H',
        },
        {
          value: '7D',
          checked: true,
        },
        {
          value: '30D',
        },
        {
          value: '90D',
        },
      ]}
    />
  )
}
