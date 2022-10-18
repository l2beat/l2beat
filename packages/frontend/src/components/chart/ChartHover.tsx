import cx from 'classnames'
import React from 'react'

export function ChartHover() {
  return (
    <div data-role="chart-hover" className="hidden">
      <div
        data-role="chart-hover-line"
        className="absolute block top-0 h-full w-0.5 bg-current z-30"
      />
      <div
        data-role="chart-hover-circle"
        className="absolute block w-2 h-2 rounded-full border-2 border-current bg-white dark:bg-black z-40"
      />
      <div
        data-role="chart-hover-square-blue"
        className="absolute block w-2 h-2 border-2 border-current bg-blue-600 z-40 rotate-45"
      />
      <div
        data-role="chart-hover-circle-red"
        className="absolute block w-2 h-2 rounded-full border-2 border-current bg-red-300 z-40"
      />
      <div
        data-role="chart-hover-contents"
        className={cx(
          'absolute z-40 py-2 md:py-3 px-3 md:px-4 text-right text-2xs md:text-xs rounded-lg',
          'bg-gray-100 dark:bg-gray-800 shadow-[0_4px_8px_rgba(0,0,0,0.25)]',
          'select-none pointer-events-none',
          'flex flex-col justify-center items-start',
        )}
      ></div>
    </div>
  )
}
