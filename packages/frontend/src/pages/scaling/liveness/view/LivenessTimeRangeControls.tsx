import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function LivenessTimeRangeControls() {
  return (
    <RadioGroup
      role="liveness-time-range-controls"
      name="liveness-time-range"
      className="w-min"
      options={[
        {
          value: '30D',
          checked: true,
        },
        {
          value: '90D',
        },
        {
          value: 'MAX',
        },
      ]}
    />
  )
}
