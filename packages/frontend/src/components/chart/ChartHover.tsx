import cx from 'classnames'
import React from 'react'

export function ChartHover() {
  return (
    <div data-role="chart-hover" className="hidden">
      <div
        data-role="chart-hover-line"
        className="absolute top-0 z-30 block h-full w-0.5 bg-current"
      />
      <div
        data-role="chart-hover-circle"
        className="absolute z-40 block h-2 w-2 rounded-full border-2 border-current bg-white dark:bg-black"
      />
      <div
        data-role="chart-hover-square-blue"
        className="absolute z-40 block h-2 w-2 border-2 border-current bg-blue-600"
      />
      <div
        data-role="chart-hover-circle-red"
        className="absolute z-40 block h-2 w-2 rounded-full border-2 border-current bg-red-300"
      />
      <div
        data-role="chart-hover-square-green"
        className="absolute z-40 block h-2 w-2 rotate-45 border-2  border-green-200 bg-green-600 dark:border-current dark:bg-green-500"
      />

      <div
        data-role="chart-hover-contents"
        className={cx(
          'absolute z-50 rounded-lg py-2 px-3 text-right text-2xs md:py-3 md:px-4 md:text-xs',
          'bg-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.25)] dark:bg-gray-750',
          'select-none',
          'flex flex-col items-start justify-center',
        )}
      />
    </div>
  )
}
