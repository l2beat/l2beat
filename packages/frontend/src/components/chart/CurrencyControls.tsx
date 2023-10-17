import React from 'react'

import { RadioGroup } from './RadioGroup'

export function CurrencyControls() {
  return (
    <RadioGroup
      role="chart-currency-controls"
      name="currency"
      className="transition-colors duration-200 group-data-[interactivity-disabled]/chart:bg-gray-100 dark:group-data-[interactivity-disabled]/chart:bg-zinc-900"
      optionsClassname="group-data-[interactivity-disabled]/chart:opacity-0 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none"
      options={[{ value: 'USD', checked: true }, { value: 'ETH' }]}
    />
  )
}
