import React from 'react'

import { cn } from '../../utils/cn'

export function ChartHover() {
  return (
    <div data-role="chart-hover" className="hidden">
      <div
        data-role="chart-hover-line"
        className="absolute top-0 z-30 block h-full w-0.5 bg-current"
      />
      <div data-role="chart-hover-points" />
      <div
        data-role="chart-hover-contents"
        className={cn(
          'absolute z-50 rounded-lg px-3 py-2 text-right text-2xs md:px-4 md:py-3 md:text-xs',
          'bg-white shadow-[0_4px_8px_rgba(0,0,0,0.25)] dark:bg-neutral-700',
          'pointer-events-none select-none',
          'flex flex-col items-start justify-center',
          'transition-[bottom] duration-[50ms] ease-linear',
        )}
      />
    </div>
  )
}
