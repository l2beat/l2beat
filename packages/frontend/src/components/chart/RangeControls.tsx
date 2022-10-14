import React from 'react'

import { RadioGroup } from './RadioGroup'

export function RangeControls({
  days,
  type,
}: {
  days: number
  type: 'tvl' | 'activity'
}) {
  const options = [
    { value: '30D', checked: days === 30 },
    { value: '90D', className: '!hidden sm:!block' },
    { value: '180D', className: '!hidden sm:!block' },
    { value: '1Y' },
    { value: 'MAX' },
  ]

  if (type !== 'activity') {
    options.unshift({ value: '7D', checked: days === 7 })
  }

  return (
    <RadioGroup role="chart-range-controls" name="range" options={options} />
  )
}
