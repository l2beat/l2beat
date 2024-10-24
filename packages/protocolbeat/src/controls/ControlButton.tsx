import { ReactNode } from 'react'

export function ControlButton(props: {
  onClick: () => void
  children: ReactNode
  disabled?: boolean
}) {
  return (
    <button
      disabled={props.disabled}
      className="whitespace-pre rounded bg-blue-500 px-2 py-1 font-bold text-white text-xs hover:bg-blue-700"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
