import React from 'react'

import { RadioGroup } from './RadioGroup'

export function ScaleControls() {
  return (
    <RadioGroup
      role="chart-scale-controls"
      name="scale"
      className="transition-colors duration-200 group-data-[state=empty]/chart:bg-gray-100 dark:group-data-[state=empty]/chart:bg-zinc-900"
      optionsClassname="group-data-[state=empty]/chart:opacity-0 transition-opacity duration-200 group-data-[state=empty]/chart:pointer-events-none"
      options={[{ value: 'LOG' }, { value: 'LIN', checked: true }]}
    />
  )
}
