import React from 'react'

import { ChartButton } from './ChartButton'

export function CurrencyControls() {
  return (
    <div
      data-role="chart-currency-controls"
      className="col-span-2 sm:col-span-1 flex items-center justify-start gap-4"
    >
      <ChartButton checked name="currency" value="USD" />
      <ChartButton name="currency" value="ETH">
        ETH<sup>*</sup>
      </ChartButton>
    </div>
  )
}
