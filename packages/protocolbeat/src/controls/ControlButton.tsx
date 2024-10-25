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
        'whitespace-pre rounded px-2 py-1 font-bold text-white text-xs',
        !props.disabled && 'bg-blue-500 hover:bg-blue-700',
        props.disabled && 'bg-blue-300',
      )}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
