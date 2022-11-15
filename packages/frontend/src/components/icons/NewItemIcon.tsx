import cx from 'classnames'
import React from 'react'

export function NewItemIcon({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        'bg-yellow-200 text-purple-700 px-1 rounded-sm',
        'text-2xs md:text-sm leading-tight font-bold',
        className,
      )}
    >
      New
    </span>
  )
}
