import cx from 'classnames'
import React, { ReactNode } from 'react'

export interface CalloutProps {
  color?: 'red' | 'yellow' | 'blue'
  icon: ReactNode
  body: ReactNode
  className?: string
  hoverable?: boolean
  small?: boolean
}

export function Callout({
  color,
  icon,
  body,
  className,
  hoverable,
  small,
}: CalloutProps) {
  let background: string
  if (hoverable && color === 'red') {
    background = 'bg-red-600 hover:bg-red-500'
  } else if (hoverable && color === 'yellow') {
    background = 'bg-yellow-700 hover:bg-opacity-40'
  } else if (color === 'red') {
    background = 'bg-red-600'
  } else if (color === 'yellow') {
    background = 'bg-yellow-700'
  } else if (color === 'blue') {
    background = 'bg-blue-700'
  } else {
    background = ''
  }

  return (
    <div
      className={cx(
        'flex first:mt-0',
        'rounded-lg bg-opacity-20',
        background,
        className,
        small ? 'gap-2 rounded-[4px] text-sm' : 'gap-3',
      )}
    >
      <span>{icon}</span>
      <div>{body}</div>
    </div>
  )
}
