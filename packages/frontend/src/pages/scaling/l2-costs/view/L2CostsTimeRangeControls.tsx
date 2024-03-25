import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function L2CostsTimeRangeControls() {
  return (
    <RadioGroup
      role="l2-costs-time-range-controls"
      name="l2-costs-time-range"
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
