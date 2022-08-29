import classNames from 'classnames'
import React from 'react'

export function YAxisLabels() {
  return (
    <div className="absolute flex flex-col left-0 top-0 w-full h-full opacity-80">
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
        'flex items-end text-sm border-b border-bg-4',
        className,
      )}
    >
      ...
    </div>
  )
}
