import React from 'react'

import { RadioGroup } from '../../../../components/chart/RadioGroup'

export function FeesTypeControls() {
  return (
    <RadioGroup
      role="fees-type-controls"
      name="fees-type"
      className="w-min"
      options={[
        {
          value: 'USD',
          checked: true,
        },
        {
          value: 'GWEI',
        },
      ]}
    />
  )
}
