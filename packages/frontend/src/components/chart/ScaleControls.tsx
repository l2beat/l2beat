import React from 'react'

import { RadioGroup } from './RadioGroup'

export function ScaleControls() {
  return (
    <RadioGroup
      role="chart-scale-controls"
      name="scale"
      options={[{ value: 'LOG' }, { value: 'LIN', checked: true }]}
    />
  )
}
