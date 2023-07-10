import cx from 'classnames'
import React from 'react'

export function UnderReviewBadge({
  className,
  big,
}: {
  className?: string
  big?: boolean
}) {
  return (
    <span
      className={cx(
        'inline-block rounded px-1.5 font-medium uppercase !leading-none',
        'bg-gray-750 text-yellow-200',
        big ? 'py-0.5 text-base md:text-lg' : 'py-[3px] text-xs',
        className,
      )}
    >
      <span className="relative top-[0.5px]">In review</span>
    </span>
  )
}
