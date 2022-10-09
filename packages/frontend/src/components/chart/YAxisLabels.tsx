import cx from 'classnames'
import React from 'react'

export function YAxisLabels() {
  return (
    <div className="absolute flex flex-col left-0 top-0 w-full h-full z-10">
      <Label className="h-[20px]" />
      <Label className="flex-1" />
      <Label className="flex-1" />
      <Label className="flex-1" />
      <Label className="flex-1" />
    </div>
  )
}

function Label({ className }: { className: string }) {
  return (
    <div
      data-role="chart-label"
      className={cx(
        'flex items-end text-sm text-gray-500 dark:text-gray-600',
        'border-b border-gray-300 dark:border-gray-850',
        className,
      )}
    >
      ...
    </div>
  )
}
