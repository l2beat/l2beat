import classNames from 'classnames'
import React from 'react'

export function YAxisLabels() {
  return (
    <div className="absolute flex flex-col left-0 top-0 w-full h-full opacity-80 z-30">
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
      className={classNames(
        'flex items-end text-sm border-b border-black dark:border-white border-opacity-30 dark:border-opacity-30',
        className,
      )}
    >
      ...
    </div>
  )
}
