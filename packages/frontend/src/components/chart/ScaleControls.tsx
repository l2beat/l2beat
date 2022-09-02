import React from 'react'

import { ChartButton } from './ChartButton'

export function ScaleControls() {
  return (
    <div
      data-role="chart-scale-controls"
      className="col-span-2 sm:col-span-1 row-start-3 sm:row-start-auto col-start-3 sm:col-start-auto flex items-center justify-end gap-4"
    >
      <ChartButton name="scale" value="LOG" />
      <ChartButton checked name="scale" value="LIN" />
    </div>
  )
}
