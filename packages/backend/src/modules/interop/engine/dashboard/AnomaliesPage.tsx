import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'
import { type DataRowResult, interpret } from './stats'

function formatCount(value: number) {
  return Math.round(value).toLocaleString()
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
          <th>Summary</th>
          <th>Interpretation</th>
        </tr>
      </thead>
      <tbody>
        {props.stats.map((row, idx) =>
          (() => {
            const summary = getSummaryValues(row)
            const interpretation = interpret(row)
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
                <td>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Δ1d {formatDiff(summary.diffDay, 0)} · Δ7d{' '}
                    {formatDiff(summary.diff7d, 0)}
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
                <td>{interpretation || '-'}</td>
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
                targets: [2, 3, 4],
                type: 'num',
              },
              {
                targets: [5, 6],
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
