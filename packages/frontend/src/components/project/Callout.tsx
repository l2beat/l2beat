import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface CalloutProps {
  color: 'red' | 'yellow'
  icon: ReactNode
  body: ReactNode
}

export function Callout({ color, icon, body }: CalloutProps) {
  const background = color === 'red' ? 'bg-red-600' : 'bg-yellow-300'
  const iconFill =
    color === 'red'
      ? 'fill-red-700 dark:fill-red-300'
      : 'fill-yellow-700 dark:fill-yellow-300'

  return (
    <div
      className={cx(
        'flex gap-3 mt-4 first:mt-0 md:mt-6 p-4',
        'bg-opacity-20 rounded-lg',
        background,
      )}
    >
      <span>{icon}</span>
      <div>{body}</div>
    </div>
  )
}
