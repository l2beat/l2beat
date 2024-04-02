import compact from 'lodash/compact'
import React from 'react'

import { RadioGroup } from './RadioGroup'

interface Props {
  showGas?: boolean
}

export function UnitControls(props: Props) {
  return (
    <RadioGroup
      role="chart-unit-controls"
      name="unit"
      className="transition-colors duration-200 group-data-[interactivity-disabled]/chart:bg-gray-200 dark:group-data-[interactivity-disabled]/chart:bg-zinc-700"
      optionsClassname="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none"
      options={compact([
        { value: 'USD', checked: true },
        { value: 'ETH' },
        props.showGas && { value: 'GAS' },
      ])}
    />
  )
}
