import classNames from 'classnames'
import React from 'react'

interface Props {
  className?: string
}

export function ChartLabels(props: Props) {
  return (
    <div
      className={classNames(
        'pointer-events-none relative z-25 flex h-full flex-col justify-between pt-[20px]',
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
        className="absolute left-0 bottom-0 pb-0.5 text-sm text-gray-500 text-opacity-50 transition-opacity duration-200 group-data-[interactivity-disabled]/chart:pointer-events-none group-data-[interactivity-disabled]/chart:opacity-0 dark:text-white dark:text-opacity-50"
      />
      <hr className="border-gray-850 border-opacity-30 dark:border-white dark:border-opacity-30" />
    </div>
  )
}
