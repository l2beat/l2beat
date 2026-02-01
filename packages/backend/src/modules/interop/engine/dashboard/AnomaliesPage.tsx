import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'
import type { DataRowResult } from './stats'

function formatCount(value: number) {
  return Math.round(value).toLocaleString()
}

function formatZ(value: number) {
  if (Number.isNaN(value)) return '-'
  if (!Number.isFinite(value)) return value > 0 ? '∞' : '-∞'
  return value.toFixed(2)
}

function formatDiff(value: number | null, digits = 2) {
  return value === null ? '-' : value.toFixed(digits)
}

function formatPercent(value: number | null) {
  if (value === null) return '-'
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function getPercentColor(value: number | null) {
  if (value === null) return '#6b7280'
  const capped = Math.min(Math.abs(value), 100)
  const intensity = capped / 100
  const lightness = 55 - Math.round(intensity * 20)
  const hue = value >= 0 ? 140 : 0
  return `hsl(${hue}, 80%, ${lightness}%)`
}

function getSummaryValues(row: DataRowResult) {
  const diffDay =
    row.prevDayCount === null ? null : row.lastCount - row.prevDayCount
  const diff7d =
    row.prev7dCount === null ? null : row.lastCount - row.prev7dCount
  const prevDay = row.prevDayCount
  const prev7d = row.prev7dCount
  const pctDiffDay =
    diffDay === null || prevDay === null || prevDay === 0
      ? null
      : (diffDay / prevDay) * 100
  const pctDiff7d =
    diff7d === null || prev7d === null || prev7d === 0
      ? null
      : (diff7d / prev7d) * 100
  return { diffDay, diff7d, pctDiffDay, pctDiff7d }
}

function getStatus(row: DataRowResult) {
  const isAnomaly =
    row.z.robust.isAnomaly ||
    row.z.classic.isAnomaly ||
    row.isFlatLine ||
    row.isRatioDrop ||
    row.isRatioSpike
  return isAnomaly
    ? { label: 'not ok', color: '#dc2626' }
    : { label: 'ok', color: '#16a34a' }
}

function AnomaliesTable(props: { stats: DataRowResult[] }) {
  return (
    <table id="anomalies" className="display">
      <thead>
        <tr>
          <th>Day (UTC)</th>
          <th>Transfer ID</th>
          <th>Count</th>
          <th>Prev Day</th>
          <th>Prev 7d</th>
          <th>Z-Robust</th>
          <th>Z-Classic</th>
          <th>Summary</th>
          <th>Flat line</th>
          <th>Ratio drop</th>
          <th>Ratio spike</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.stats.map((row, idx) =>
          (() => {
            const status = getStatus(row)
            const summary = getSummaryValues(row)
            return (
              <tr key={`${row.id}-${row.timestamp}-${idx}`}>
                <td data-order={row.timestamp}>
                  {row.timestamp}{' '}
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>
                    ({row.dataPoints.length}d)
                  </span>
                </td>
                <td>
                  <a
                    href={`/interop/anomalies/${encodeURIComponent(row.id)}`}
                    title="View chart for this id"
                  >
                    {row.id}
                  </a>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    chart
                  </div>
                </td>
                <td>{formatCount(row.lastCount)}</td>
                <td>
                  {row.prevDayCount === null
                    ? '-'
                    : formatCount(row.prevDayCount)}
                </td>
                <td>
                  {row.prev7dCount === null
                    ? '-'
                    : formatCount(row.prev7dCount)}
                </td>
                <td>{formatZ(row.z.robust.value)}</td>
                <td>{formatZ(row.z.classic.value)}</td>
                <td>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Δ1d {formatDiff(summary.diffDay)} · Δ7d{' '}
                    {formatDiff(summary.diff7d)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    1d{' '}
                    <span
                      style={{
                        color: getPercentColor(summary.pctDiffDay),
                        fontWeight: 600,
                      }}
                    >
                      {formatPercent(summary.pctDiffDay)}
                    </span>{' '}
                    · 7d{' '}
                    <span
                      style={{
                        color: getPercentColor(summary.pctDiff7d),
                        fontWeight: 600,
                      }}
                    >
                      {formatPercent(summary.pctDiff7d)}
                    </span>
                  </div>
                </td>
                <td>{row.isFlatLine ? 'yes' : 'no'}</td>
                <td>{row.isRatioDrop ? 'yes' : 'no'}</td>
                <td>{row.isRatioSpike ? 'yes' : 'no'}</td>
                <td>
                  <span style={{ color: status.color, fontWeight: 600 }}>
                    {status.label}
                  </span>
                </td>
              </tr>
            )
          })(),
        )}
      </tbody>
    </table>
  )
}

function AnomaliesPageLayout(props: { stats: DataRowResult[] }) {
  const anomaliesTable = <AnomaliesTable stats={props.stats} />

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Aggregated Transfer Anomalies (Latest per ID)',
          table: anomaliesTable,
          tableId: 'anomalies',
          dataTableOptions: {
            order: [
              [0, 'desc'],
              [1, 'asc'],
            ],
            columnDefs: [
              {
                targets: [2, 3, 4, 5, 6],
                type: 'num',
              },
              {
                targets: [7, 8, 9, 10, 11],
                orderable: false,
              },
            ],
          },
        },
      ]}
    />
  )
}

export function renderAnomaliesPage(props: { stats: DataRowResult[] }) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<AnomaliesPageLayout {...props} />)
  )
}
