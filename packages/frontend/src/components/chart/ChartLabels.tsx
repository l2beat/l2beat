import React from 'react'

export function ChartLabels() {
  return (
    <div
      data-role="chart-labels"
      className="pointer-events-none relative z-25 hidden h-full flex-col justify-between pt-[20px] opacity-70 data-[enabled=true]:flex"
    >
      <ChartLabel />
      <ChartLabel />
      <ChartLabel />
      <ChartLabel />
      <ChartLabel />
    </div>
  )
}

function ChartLabel() {
  return (
    <div className="relative">
      <span data-role="chart-label" className="absolute left-0 bottom-0">
        $123
      </span>
      <hr />
    </div>
  )
}
