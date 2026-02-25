import type { InteropTransferRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { InteropAggregationConfig } from '../../../../config/features/interop'
import { InteropTransferClassifier } from '../aggregation/InteropTransferClassifier'
import { DataTablePage } from './DataTablePage'
import { formatDollars } from './formatDollars'
import { TransfersTable } from './TransfersPage'

type InteropBridgeType =
  | 'lockAndMint'
  | 'burnAndMint'
  | 'nonMinting'
  | 'unknown'

interface ByPluginRow {
  plugin: string
  bridgeType: InteropBridgeType
  count: number
  totalValueUsd: number
}

function buildByPlugin(transfers: InteropTransferRecord[]): ByPluginRow[] {
  const grouped = new Map<string, { count: number; totalValueUsd: number }>()

  for (const t of transfers) {
    const bridgeType =
      t.bridgeType ?? InteropTransferClassifier.inferBridgeType(t)
    const key = `${t.plugin}:${bridgeType}`
    const valueUsd = t.srcValueUsd ?? t.dstValueUsd ?? 0

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

function ByPluginTable(props: { rows: ByPluginRow[] }) {
  return (
    <table id="byPluginTable" className="display">
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

function AggregatesPageLayout(props: {
  transfers: InteropTransferRecord[]
  configs: InteropAggregationConfig[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  const byPlugin = buildByPlugin(props.transfers)
  const byPluginTable = <ByPluginTable rows={byPlugin} />
  const detailTable = (
    <TransfersTable
      transfers={props.transfers}
      getExplorerUrl={props.getExplorerUrl}
      tableId="detailTable"
    />
  )

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Not included in latest aggregates by plugins',
          table: byPluginTable,
          tableId: 'byPluginTable',
          dataTableOptions: {
            order: [[3, 'desc']],
            pageLength: 25,
          },
        },
        {
          title: 'Not included in latest aggregates',
          table: detailTable,
          tableId: 'detailTable',
          dataTableOptions: {
            order: [[0, 'desc']],
            columnDefs: [{ targets: 0, type: 'num' }],
          },
        },
      ]}
    />
  )
}

export function renderAggregatesPage(props: {
  transfers: InteropTransferRecord[]
  configs: InteropAggregationConfig[]
  getExplorerUrl: (chain: string) => string | undefined
}) {
  return (
    '<!DOCTYPE html>' +
    renderToStaticMarkup(<AggregatesPageLayout {...props} />)
  )
}
