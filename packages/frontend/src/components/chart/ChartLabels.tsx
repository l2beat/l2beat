import React from 'react'

import { cn } from '../../utils/cn'

interface Props {
  className?: string
}

export function ChartLabels(props: Props) {
  return (
    <div
      className={cn(
        'pointer-events-none relative z-25 flex h-full flex-col justify-between pt-5',
        props.className,
      )}
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
      <span
        data-role="chart-label"
        className="absolute bottom-0 left-0 pb-0.5 text-gray-500 text-sm text-opacity-50 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none dark:text-white dark:text-opacity-50 group-data-[interactivity-disabled]/chart:opacity-0"
      />
      <hr className="border-gray-850/30 dark:border-white/30" />
    </div>
  )
}
