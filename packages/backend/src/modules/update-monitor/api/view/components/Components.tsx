import React, { type ReactNode } from 'react'

export function TableData(props: {
  value?: number | string | ReactNode
  color?: string
}) {
  return (
    <td
      style={{
        padding: '2px 12px',
        textAlign: 'left',
        color: props.color ?? '',
      }}
    >
      {props.value !== undefined && props.value}
    </td>
  )
}
