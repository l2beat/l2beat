import type { InteropTransferRecord } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { getInteropTransferValue } from '@l2beat/shared-pure'
import React from 'react'
import { formatDollars } from '../formatDollars'

type InteropBridgeType =
  | 'lockAndMint'
  | 'burnAndMint'
  | 'nonMinting'
  | 'unknown'

export interface NotIncludedInAggregatesRow {
  plugin: string
  bridgeType: InteropBridgeType
  count: number
  totalValueUsd: number
}

export function buildNotIncludedInAggregatesRows(
  transfers: InteropTransferRecord[],
): NotIncludedInAggregatesRow[] {
  const grouped = new Map<string, { count: number; totalValueUsd: number }>()

  for (const transfer of transfers) {
    const bridgeType =
      transfer.bridgeType ?? InteropTransferClassifier.inferBridgeType(transfer)
    const key = `${transfer.plugin}:${bridgeType}`
    const valueUsd = getInteropTransferValue(transfer) ?? 0

    const existing = grouped.get(key)
    if (existing) {
      existing.count += 1
      existing.totalValueUsd += valueUsd
    } else {
      grouped.set(key, { count: 1, totalValueUsd: valueUsd })
    }
  }

  return Array.from(grouped.entries())
    .map(([key, { count, totalValueUsd }]) => {
      const [plugin, bridgeType] = key.split(':') as [string, InteropBridgeType]
      return { plugin, bridgeType, count, totalValueUsd }
    })
    .sort((a, b) => b.totalValueUsd - a.totalValueUsd)
}

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
