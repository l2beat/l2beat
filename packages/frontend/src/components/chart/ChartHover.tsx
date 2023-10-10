import cx from 'classnames'
import React from 'react'

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
        className={cx(
          'absolute z-50 rounded-lg py-2 px-3 text-right text-2xs md:py-3 md:px-4 md:text-xs',
          'bg-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.25)] dark:bg-gray-750',
          'pointer-events-none select-none',
          'flex flex-col items-start justify-center',
          'transition-[bottom] duration-[50ms] ease-linear',
        )}
      />
    </div>
  )
}
