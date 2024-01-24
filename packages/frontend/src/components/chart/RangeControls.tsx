import React from 'react'

import { cn } from '../../utils/cn'
import { RadioGroup } from './RadioGroup'

export function RangeControls({
  isActivity,
  isMetaChart,
}: {
  isActivity: boolean
  isMetaChart: boolean
}) {
  return (
    <RadioGroup
      role="chart-range-controls"
      name="range"
      className={cn(
        'transition-colors duration-200 group-data-[interactivity-disabled]/chart:bg-gray-100 dark:group-data-[interactivity-disabled]/chart:bg-zinc-900',
        isMetaChart && 'hidden',
      )}
      optionsClassname="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none"
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
