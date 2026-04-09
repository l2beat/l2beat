import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { BlockProcessingStat } from '../sync/InteropSyncersManager'
import { DataTablePage } from './DataTablePage'

interface StatsRow {
  label: string
  totalMs: number
  cpuMs: number
  count: number
  avgMs: number
  avgCpuMs: number
}

function formatMs(value: number) {
  const rounded = Math.round(value * 100) / 100
  return Number.isInteger(rounded)
    ? rounded.toString()
    : rounded.toFixed(2).replace(/\.?0+$/, '')
}

function StatsTable(props: { rows: StatsRow[]; tableId: string }) {
  return (
    <table id={props.tableId} className="display">
      <thead>
        <tr>
          <th>name</th>
          <th>calls</th>
          <th>avg (ms)</th>
          <th>avg cpu (ms)</th>
        </tr>
      </thead>
      <tbody>
        {props.rows.map((row) => (
          <tr key={row.label}>
            <td>{row.label}</td>
            <td>{row.count}</td>
            <td data-order={row.avgMs}>{formatMs(row.avgMs)}</td>
            <td data-order={row.avgCpuMs}>{formatMs(row.avgCpuMs)}</td>
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
  const map = new Map<
    string,
    { totalMs: number; cpuMs: number; count: number }
  >()
  for (const s of stats) {
    const key = keyFn(s)
    const entry = map.get(key) ?? { totalMs: 0, cpuMs: 0, count: 0 }
    entry.totalMs += s.totalMs
    entry.cpuMs += s.cpuMs
    entry.count += s.count
    map.set(key, entry)
  }
  return [...map.entries()].map(([label, { totalMs, cpuMs, count }]) => ({
    label,
    totalMs,
    cpuMs,
    count,
    avgMs: count > 0 ? totalMs / count : 0,
    avgCpuMs: count > 0 ? cpuMs / count : 0,
  }))
}

export function renderBlockStatsPage(stats: BlockProcessingStat[]) {
  const perClusterChain = stats.map((s) => ({
    label: `${s.cluster}:${s.chain}`,
    totalMs: s.totalMs,
    cpuMs: s.cpuMs,
    count: s.count,
    avgMs: s.avgMs,
    avgCpuMs: s.avgCpuMs,
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
          dataTableOptions: { order: [[2, 'desc']] },
        },
        {
          title: 'Per chain (aggregated)',
          table: <StatsTable rows={perChain} tableId="perChain" />,
          tableId: 'perChain',
          dataTableOptions: { order: [[2, 'desc']] },
        },
        {
          title: 'Per cluster (aggregated)',
          table: <StatsTable rows={perCluster} tableId="perCluster" />,
          tableId: 'perCluster',
          dataTableOptions: { order: [[2, 'desc']] },
        },
      ]}
    />
  )

  return '<!DOCTYPE html>' + renderToStaticMarkup(page)
}
