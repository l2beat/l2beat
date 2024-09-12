import { type VariantProps, cva } from 'class-variance-authority'
import React, { type ReactNode } from 'react'

const calloutVariants = cva('flex rounded-lg', {
  variants: {
    color: {
      red: 'bg-red-600/20 hover:bg-red-500/20',
      yellow: 'bg-yellow-700/20',
      blue: 'bg-blue-700/20',
      gray: 'bg-gray-500/20',
    },
    small: {
      true: 'gap-2 rounded text-sm',
      false: 'gap-3',
    },
  },
  defaultVariants: {
    small: false,
  },
})

export interface CalloutProps extends VariantProps<typeof calloutVariants> {
  icon: ReactNode
  body: ReactNode
  message?: ReactNode
  className?: string
}

export function Callout({
  color,
  small,
  icon,
  body,
  message,
  className,
}: CalloutProps) {
  return (
    <div className={calloutVariants({ color, small, className })}>
      <span>{icon}</span>
      <div className="flex flex-col gap-2">
        {message}
        <div>{body}</div>
      </div>
    </div>
  )
}
