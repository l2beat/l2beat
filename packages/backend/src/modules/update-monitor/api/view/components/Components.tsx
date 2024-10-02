import React, { ReactNode } from 'react'

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

export function TableHead(props: {
  children?: ReactNode
  rowSpan?: number
  colSpan?: number
  style?: React.CSSProperties
}) {
  return (
    <th
      rowSpan={props.rowSpan}
      colSpan={props.colSpan}
      style={{ padding: '2px 12px', textAlign: 'left', ...props.style }}
    >
      {props.children}
    </th>
  )
}
