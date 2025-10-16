import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'

export type ProcessorsStatus = {
  chain: string
  block: number
  timestamp: number
}

export function ProcessorsStatusTable(props: {
  processors: ProcessorsStatus[]
}) {
  return (
    <table>
      <caption>Processors status</caption>
      <thead>
        <th>chain</th>
        <th>latest block</th>
        <th>latest timestamp</th>
      </thead>
      <tbody>
        {props.processors.map((p) => (
          <tr>
            <td>{p.chain}</td>
            <td>{p.block}</td>
            <td>{UnixTime.toDate(p.timestamp).toUTCString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
