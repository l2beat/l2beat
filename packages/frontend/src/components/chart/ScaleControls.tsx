import React from 'react'

import { ChartType } from '../../scripts/charts/types'
import { RadioGroup } from './RadioGroup'

interface Props {
  chartType: ChartType
}

export function ScaleControls({ chartType }: Props) {
  return (
    <RadioGroup
      role="chart-scale-controls"
      name={`${chartType.type}-scale`}
      className="transition-colors duration-200 group-data-[interactivity-disabled]/chart:bg-gray-200 dark:group-data-[interactivity-disabled]/chart:bg-zinc-700"
      optionsClassname="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none"
      options={[{ value: 'LOG' }, { value: 'LIN', checked: true }]}
    />
  )
}
