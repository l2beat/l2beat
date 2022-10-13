import React from 'react'

import { RadioGroup } from './RadioGroup'

export function CurrencyControls() {
  return (
    <RadioGroup
      role="chart-currency-controls"
      name="currency"
      options={[{ value: 'USD', checked: true }, { value: 'ETH' }]}
    />
  )
}
