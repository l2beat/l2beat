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
        className="absolute z-40 block h-2 w-2 rotate-45 border-2 border-green-200 bg-green-600 dark:border-current dark:bg-green-500"
      />
      <svg
        data-role="chart-hover-circle-purple"
        className="absolute z-40 h-2 w-2 stroke-black dark:stroke-white"
        xmlns="http://www.w3.org/2000/svg"
        width="9"
        height="9"
        viewBox="0 0 9 9"
      >
        <circle cx="4.5" cy="4.5" r="3.5" fill="#A64EFF" strokeWidth="1.5" />
      </svg>
      <svg
        data-role="chart-hover-triangle-yellow"
        className="absolute z-40 h-3 w-3 stroke-black dark:stroke-white"
        xmlns="http://www.w3.org/2000/svg"
        width="11"
        height="9"
        viewBox="0 0 11 9"
      >
        <path
          d="M1.16987 8.5L5.5 1L9.83013 8.5H1.16987Z"
          fill="#EF8F00"
          strokeWidth="1.5"
        />
      </svg>

      <svg
        data-role="chart-hover-square-pink"
        className="absolute z-40 h-2 w-2 stroke-black dark:stroke-white"
        width="9"
        height="9"
        viewBox="0 0 9 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0" y="0" width="9" height="9" fill="#FF46C0" strokeWidth="3" />
      </svg>

      <div
        data-role="chart-hover-contents"
        className={cx(
          'absolute z-50 rounded-lg py-2 px-3 text-right text-2xs md:py-3 md:px-4 md:text-xs',
          'bg-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.25)] dark:bg-gray-750',
          'pointer-events-none select-none',
          'flex flex-col items-start justify-center',
        )}
      />
    </div>
  )
}
