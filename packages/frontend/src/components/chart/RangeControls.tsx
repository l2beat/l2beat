import React from 'react'

import { ChartButton } from './ChartButton'

export function RangeControls({ days }: { days: number }) {
  return (
    <div
      data-role="chart-range-controls"
      className="col-span-2 flex items-center justify-end gap-4"
    >
      <ChartButton checked={days === 7} name="range" value="7D" />
      <ChartButton checked={days === 30} name="range" value="30D" />
      <ChartButton className="!hidden sm:!block" name="range" value="90D" />
      <ChartButton className="!hidden sm:!block" name="range" value="180D" />
      <ChartButton name="range" value="1Y" />
      <ChartButton name="range" value="MAX" />
    </div>
  )
}
