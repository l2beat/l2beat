import React from 'react'
import { formatDollars } from '../formatDollars'
import type { NotIncludedInAggregatesRow } from './utils'

export { buildNotIncludedInAggregatesRows } from './utils'

export function NotIncludedInAggregatesTable(props: {
  rows: NotIncludedInAggregatesRow[]
}) {
  return (
    <table id="notIncludedInAggregatesTable" className="display">
      <thead>
        <tr>
          <th>Plugin</th>
          <th>Bridge Type</th>
          <th>Count</th>
          <th>Total Value USD</th>
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row) => (
          <tr key={`${row.plugin}-${row.bridgeType}`}>
            <td>{row.plugin}</td>
            <td>{row.bridgeType}</td>
            <td data-order={row.count}>{row.count}</td>
            <td data-order={row.totalValueUsd}>
              {formatDollars(row.totalValueUsd)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
