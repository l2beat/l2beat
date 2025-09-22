import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export function ControlButton(props: {
  onClick?: () => void
  children: ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <button
      disabled={props.disabled}
      className={clsx(
        'w-full whitespace-pre border border-coffee-600 bg-coffee-800 px-2 py-1 text-xs',
        !props.disabled && '',
        props.disabled && 'text-coffee-400',
        props.className,
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
