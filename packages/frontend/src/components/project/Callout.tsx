import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface CalloutProps {
  color?: 'red' | 'yellow'
  icon: ReactNode
  body: ReactNode
  className?: string
  hoverable?: boolean
}

export function Callout({
  color,
  icon,
  body,
  className,
  hoverable,
}: CalloutProps) {
  let background: string
  if (hoverable && color === 'red') {
    background = 'bg-red-600 hover:bg-red-500'
  } else if (hoverable && color === 'yellow') {
    background = 'bg-yellow-300 hover:bg-opacity-40'
  } else if (color === 'red') {
    background = 'bg-red-600'
  } else if (color === 'yellow') {
    background = 'bg-yellow-300'
  } else {
    background = ''
  }

  return (
    <div
      className={cx(
        'flex gap-3 first:mt-0',
        'rounded-lg bg-opacity-20',
        background,
        className,
      )}
    >
      <span>{icon}</span>
      <div>{body}</div>
    </div>
  )
}
