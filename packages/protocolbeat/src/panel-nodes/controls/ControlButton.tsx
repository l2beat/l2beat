import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export function ControlButton(props: {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      disabled={props.disabled}
      className={clsx(
        'whitespace-pre border border-coffee-600 bg-coffee-800 px-2 py-1 text-xs',
        !props.disabled && '',
        props.disabled && 'text-coffee-400',
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
