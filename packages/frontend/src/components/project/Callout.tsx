import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface CalloutProps {
  color?: 'red' | 'yellow'
  icon: ReactNode
  body: ReactNode
  className?: string
}

export function Callout({ color, icon, body, className }: CalloutProps) {
  const background =
    color === 'red' ? 'bg-red-600' : color === 'yellow' ? 'bg-yellow-300' : ''

  const mmm = color === 'red' || color === 'yellow' ? 'p-4' : 'pl-4'

  return (
    <div
      className={cx(
        'flex gap-3 first:mt-0',
        'bg-opacity-20 rounded-lg',
        mmm,
        background,
        className,
      )}
    >
      <span>{icon}</span>
      <div>{body}</div>
    </div>
  )
}
