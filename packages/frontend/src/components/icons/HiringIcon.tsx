import cx from 'classnames'
import React from 'react'

export function HiringIcon({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        ' bg-pink-900 text-white px-1 rounded-sm',
        'text-xs leading-tight font-bold',
        className,
      )}
    >
      We're hiring
    </span>
  )
}
