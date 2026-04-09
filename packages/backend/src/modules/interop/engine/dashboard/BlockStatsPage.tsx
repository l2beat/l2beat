import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { BlockProcessingStat } from '../sync/InteropSyncersManager'
import { DataTablePage } from './DataTablePage'

function StatsTable(props: {
  rows: { label: string; totalMs: number; count: number; avgMs: number }[]
  tableId: string
}) {
  return (
    <table id={props.tableId} className="display">
      <thead>
        <tr>
          <th>name</th>
          <th>calls</th>
          <th>total (ms)</th>
          <th>avg (ms)</th>
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>{row.count}</td>
            <td>{row.totalMs}</td>
            <td>{row.avgMs}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function aggregate(
  stats: BlockProcessingStat[],
  keyFn: (s: BlockProcessingStat) => string,
) {
  const map = new Map<string, { totalMs: number; count: number }>()
  for (const s of stats) {
    const key = keyFn(s)
    const entry = map.get(key) ?? { totalMs: 0, count: 0 }
    entry.totalMs += s.totalMs
    entry.count += s.count
    map.set(key, entry)
  }
  return [...map.entries()].map(([label, { totalMs, count }]) => ({
    label,
    totalMs,
    count,
    avgMs: count > 0 ? Math.round(totalMs / count) : 0,
  }))
}

export function renderBlockStatsPage(stats: BlockProcessingStat[]) {
  const perClusterChain = stats.map((s) => ({
    label: `${s.cluster}:${s.chain}`,
    totalMs: s.totalMs,
    count: s.count,
    avgMs: s.avgMs,
  }))
  const perChain = aggregate(stats, (s) => s.chain)
  const perCluster = aggregate(stats, (s) => s.cluster)

  const page = (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'processNewestBlock stats — per cluster:chain',
          table: (
            <StatsTable rows={perClusterChain} tableId="perClusterChain" />
          ),
          tableId: 'perClusterChain',
          dataTableOptions: { order: [[3, 'desc']] },
        },
        {
          title: 'Per chain (aggregated)',
          table: <StatsTable rows={perChain} tableId="perChain" />,
          tableId: 'perChain',
          dataTableOptions: { order: [[3, 'desc']] },
        },
        {
          title: 'Per cluster (aggregated)',
          table: <StatsTable rows={perCluster} tableId="perCluster" />,
          tableId: 'perCluster',
          dataTableOptions: { order: [[3, 'desc']] },
        },
      ]}
    />
  )

  return '<!DOCTYPE html>' + renderToStaticMarkup(page)
}
