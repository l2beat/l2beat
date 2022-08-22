import React, { ReactNode } from 'react'

interface Props {
  checked?: boolean
  name: string
  value: string
  endpoint?: string
  children?: ReactNode
}

export function ChartButton(props: Props) {
  return (
    <label className="Chart-Button">
      <input
        defaultChecked={props.checked}
        type="radio"
        name={props.name}
        value={props.value}
        data-endpoint={props.endpoint}
      />
      <span>{props.children ?? props.value}</span>
    </label>
  )
}
