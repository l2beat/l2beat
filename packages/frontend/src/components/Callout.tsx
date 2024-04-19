import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface CalloutProps {
  color?: 'red' | 'yellow' | 'blue'
  icon: ReactNode
  body: ReactNode
  message?: ReactNode
  className?: string
  hoverable?: boolean
  small?: boolean
}

export function Callout({
  color,
  icon,
  body,
  message,
  className,
  hoverable,
  small,
}: CalloutProps) {
  let background: string
  if (hoverable && color === 'red') {
    background = 'bg-red-600/20 hover:bg-red-500/20'
  } else if (hoverable && color === 'yellow') {
    background = 'bg-yellow-700/20 hover:bg-opacity-40/20'
  } else if (color === 'red') {
    background = 'bg-red-600/20'
  } else if (color === 'yellow') {
    background = 'bg-yellow-700/20'
  } else if (color === 'blue') {
    background = 'bg-blue-700/20'
  } else {
    background = ''
  }

  return (
    <div
      className={cn(
        'flex first:mt-0',
        'rounded-lg',
        background,
        className,
        small ? 'gap-2 rounded-[4px] text-sm' : 'gap-3',
      )}
    >
      <span>{icon}</span>
      <div className="flex flex-col gap-2">
        {message && message}
        <div>{body}</div>
      </div>
    </div>
  )
}
