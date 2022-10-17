import React from 'react'

import { RadioGroup } from './RadioGroup'

export function RangeControls({
  days,
  type,
}: {
  days: number
  type: 'tvl' | 'activity'
}) {
  return (
    <RadioGroup
      role="chart-range-controls"
      name="range"
      options={[
        {
          value: '7D',
          checked: days === 7,
          className: type === 'activity' ? '!hidden' : undefined,
        },
        { value: '30D', checked: days === 30 },
        { value: '90D', className: '!hidden sm:!block' },
        { value: '180D', className: '!hidden sm:!block' },
        { value: '1Y' },
        { value: 'MAX' },
      ]}
    />
  )
}
