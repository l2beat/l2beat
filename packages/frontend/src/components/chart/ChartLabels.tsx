import React from 'react'

export function ChartLabels() {
  return (
    <div className="pointer-events-none relative z-25 flex h-full flex-col justify-between pt-[20px]">
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
      <span
        data-role="chart-label"
        className="absolute left-0 bottom-0 pb-0.5 text-sm text-gray-500 text-opacity-50 dark:text-white dark:text-opacity-50"
      />
      <hr className="border-gray-850 border-opacity-30 dark:border-white dark:border-opacity-30" />
    </div>
  )
}
