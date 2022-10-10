import React from 'react'

import { RadioGroup } from './RadioGroup'

export function RangeControls({ days }: { days: number }) {
  return (
    <RadioGroup
      role="chart-range-controls"
      name="range"
      options={[
        { value: '7D', checked: days === 7 },
        { value: '30D', checked: days === 30 },
        { value: '90D', className: '!hidden sm:!block' },
        { value: '180D', className: '!hidden sm:!block' },
        { value: '1Y' },
        { value: 'MAX' },
      ]}
    />
  )
}
