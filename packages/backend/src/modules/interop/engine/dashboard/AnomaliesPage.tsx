import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  type AggregatedInteropTransferAnomalyStats,
  Z_SCORE_THRESHOLD,
} from './anomalyStats'
import { DataTablePage } from './DataTablePage'

function formatCount(value: number | null) {
  return value === null ? '-' : value.toFixed(0)
}

function formatMetric(value: number | null, digits = 2) {
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

function getStatus(zScore: number | null) {
  if (zScore === null) return { label: '-', color: '#6b7280' }
  return Math.abs(zScore) >= Z_SCORE_THRESHOLD
    ? { label: 'not ok', color: '#dc2626' }
    : { label: 'ok', color: '#16a34a' }
}

function AnomaliesTable(props: {
  stats: AggregatedInteropTransferAnomalyStats[]
}) {
  return (
    <table id="anomalies" className="display">
      <thead>
        <tr>
          <th>Day (UTC)</th>
          <th>Transfer ID</th>
          <th>Count</th>
          <th>Prev Day</th>
          <th>Prev 7d</th>
          <th>Z-Score 7d</th>
          <th>Summary</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.stats.map((row, idx) =>
          (() => {
            const status = getStatus(row.zScore7d)
            return (
              <tr key={`${row.id}-${row.timestamp}-${idx}`}>
                <td data-order={row.timestamp}>
                  {UnixTime.toYYYYMMDD(row.timestamp)}
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
                <td>{formatCount(row.transferCount)}</td>
                <td>{formatCount(row.prevDayCount)}</td>
                <td>{formatCount(row.prev7dCount)}</td>
                <td>{formatMetric(row.zScore7d)}</td>
                <td>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    Δ1d {formatMetric(row.diffDay)} · Δ7d{' '}
                    {formatMetric(row.diff7d)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280' }}>
                    1d{' '}
                    <span
                      style={{
                        color: getPercentColor(row.pctDiffDay),
                        fontWeight: 600,
                      }}
                    >
                      {formatPercent(row.pctDiffDay)}
                    </span>{' '}
                    · 7d{' '}
                    <span
                      style={{
                        color: getPercentColor(row.pctDiff7d),
                        fontWeight: 600,
                      }}
                    >
                      {formatPercent(row.pctDiff7d)}
                    </span>
                  </div>
                </td>
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

function AnomaliesPageLayout(props: {
  stats: AggregatedInteropTransferAnomalyStats[]
}) {
  const anomaliesTable = <AnomaliesTable stats={props.stats} />

  return (
    <DataTablePage
      showHome={true}
      tables={[
        {
          title: 'Aggregated Transfer Anomalies (Latest per ID, 7-row window)',
          table: anomaliesTable,
          tableId: 'anomalies',
          dataTableOptions: {
            order: [
              [0, 'desc'],
              [1, 'asc'],
            ],
            columnDefs: [
              {
                targets: [2, 3, 4, 5],
                type: 'num',
              },
              {
                targets: [6, 7],
                orderable: false,
              },
            ],
          },
        },
      ]}
    />
  )
}

export function renderAnomaliesPage(props: {
  stats: AggregatedInteropTransferAnomalyStats[]
}) {
  return (
    '<!DOCTYPE html>' + renderToStaticMarkup(<AnomaliesPageLayout {...props} />)
  )
}
