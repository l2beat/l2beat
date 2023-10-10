import React from 'react'

import { RadioGroup } from './RadioGroup'

export function RangeControls({ isActivity }: { isActivity: boolean }) {
  return (
    <RadioGroup
      role="chart-range-controls"
      name="range"
      className="transition-colors duration-200 group-data-[state=empty]/chart:bg-gray-100 dark:group-data-[state=empty]/chart:bg-zinc-900"
      optionsClassname="group-data-[state=empty]/chart:opacity-0 transition-opacity duration-200 group-data-[state=empty]/chart:pointer-events-none"
      options={[
        {
          value: '7D',
          className: isActivity ? '!hidden' : undefined,
        },
        {
          value: '30D',
        },
        {
          value: '90D',
          className: '!hidden sm:!block',
        },
        {
          value: '180D',
          className: '!hidden sm:!block',
        },
        {
          value: '1Y',
          checked: true,
        },
        {
          value: 'MAX',
        },
      ]}
    />
  )
}
