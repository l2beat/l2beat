import { clsx } from 'clsx'
import { ReactNode } from 'react'

export function ControlButton(props: {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      disabled={props.disabled}
      className={clsx(
        'whitespace-pre border border-latte bg-coffee px-2 py-1 text-xs',
        !props.disabled && '',
        props.disabled && 'text-cream',
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
