import React from 'react'

import { ChartType } from './configure/state/State'
import { RadioGroup } from './RadioGroup'

export function RangeControls({ type }: { days: number; type: ChartType }) {
  return (
    <RadioGroup
      role="chart-range-controls"
      name="range"
      options={[
        {
          value: '7D',
          className: type === 'activity' ? '!hidden' : undefined,
        },
        { value: '30D' },
        { value: '90D', className: '!hidden sm:!block' },
        { value: '180D', className: '!hidden sm:!block' },
        { value: '1Y', checked: true },
        { value: 'MAX' },
      ]}
    />
  )
}
