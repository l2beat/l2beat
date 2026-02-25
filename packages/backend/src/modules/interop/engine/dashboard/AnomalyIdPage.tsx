import { UnixTime } from '@l2beat/shared-pure'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { DataTablePage } from './DataTablePage'

type AggregatedInteropTransferIdSeriesRecord = {
  timestamp: UnixTime
  id: string
  transferCount: number
  totalDurationSum: number
  totalSrcValueUsd: number
  totalDstValueUsd: number
}

function TransferIdPageLayout(props: {
  id: string
  series: AggregatedInteropTransferIdSeriesRecord[]
}) {
  const labels = props.series.map((row) => UnixTime.toYYYYMMDD(row.timestamp))
  const count = props.series.map((row) => row.transferCount)
  const avgDuration = props.series.map((row) =>
    row.transferCount > 0
      ? row.totalDurationSum / row.transferCount
      : undefined,
  )
  const srcValue = props.series.map((row) => row.totalSrcValueUsd)
  const dstValue = props.series.map((row) => row.totalDstValueUsd)

  const chartData = JSON.stringify({
    labels,
    count,
    avgDuration,
    srcValue,
    dstValue,
  })

  return (
    <DataTablePage
      showHome={true}
      tables={[]}
      footer={
        <div className="center">
          <h1>Aggregated transfer chart</h1>
          <p>
            ID: <strong>{props.id}</strong>
          </p>
          <div style={{ width: '100%' }}>
            <canvas
              id="transfer-id-count-chart"
              height={400}
              style={{ width: '100%' }}
            />
            <canvas
              id="transfer-id-duration-chart"
              height={400}
              style={{ width: '100%' }}
            />
            <canvas
              id="transfer-id-volume-chart"
              height={400}
              style={{ width: '100%' }}
            />
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (!window.Chart) return;
                  const data = ${chartData};
                  const countCanvas = document.getElementById('transfer-id-count-chart');
                  const durationCanvas = document.getElementById('transfer-id-duration-chart');
                  const volumeCanvas = document.getElementById('transfer-id-volume-chart');
                  if (!countCanvas || !durationCanvas || !volumeCanvas) return;

                  function formatCount(value) {
                    if (value === null || value === undefined || Number.isNaN(value)) return '—';
                    return Math.round(value).toLocaleString();
                  }

                  function formatSeconds(value) {
                    if (value === null || value === undefined || Number.isNaN(value)) return '—';
                    return value.toFixed(1) + 's';
                  }

                  function formatUsd(value) {
                    if (value === null || value === undefined || Number.isNaN(value)) return '—';
                    return '$' + value.toLocaleString(undefined, { maximumFractionDigits: 2 });
                  }

                  const sharedOptions = {
                    responsive: true,
                    interaction: { mode: 'index', intersect: false },
                    scales: { y: { beginAtZero: true } },
                  };

                  new window.Chart(countCanvas.getContext('2d'), {
                    type: 'line',
                    data: {
                      labels: data.labels,
                      datasets: [
                        {
                          label: 'Transfers count',
                          data: data.count,
                          borderColor: '#2563eb',
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          tension: 0.2,
                        },
                      ],
                    },
                    options: {
                      ...sharedOptions,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              if (context.dataset.label.startsWith('Z-score band')) {
                                return context.dataset.label + ': ' + formatCount(context.parsed.y);
                              }
                              return context.dataset.label + ': ' + formatCount(context.parsed.y);
                            },
                          },
                        },
                      },
                    },
                  });

                  new window.Chart(durationCanvas.getContext('2d'), {
                    type: 'line',
                    data: {
                      labels: data.labels,
                      datasets: [{
                        label: 'Avg transfer duration (s)',
                        data: data.avgDuration,
                        borderColor: '#16a34a',
                        backgroundColor: 'rgba(22, 163, 74, 0.1)',
                        spanGaps: true,
                        tension: 0.2,
                      }],
                    },
                    options: {
                      ...sharedOptions,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.dataset.label + ': ' + formatSeconds(context.parsed.y);
                            },
                          },
                        },
                      },
                    },
                  });

                  new window.Chart(volumeCanvas.getContext('2d'), {
                    type: 'line',
                    data: {
                      labels: data.labels,
                      datasets: [
                        {
                          label: 'Src volume (USD)',
                          data: data.srcValue,
                          borderColor: '#7c3aed',
                          backgroundColor: 'rgba(124, 58, 237, 0.1)',
                          tension: 0.2,
                        },
                        {
                          label: 'Dst volume (USD)',
                          data: data.dstValue,
                          borderColor: '#f97316',
                          backgroundColor: 'rgba(249, 115, 22, 0.1)',
                          tension: 0.2,
                        },
                      ],
                    },
                    options: {
                      ...sharedOptions,
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return context.dataset.label + ': ' + formatUsd(context.parsed.y);
                            },
                          },
                        },
                      },
                    },
                  });
                })();
              `,
            }}
          />
        </div>
      }
    />
  )
}

export function renderAnomalyIdPage(props: {
  id: string
  series: AggregatedInteropTransferIdSeriesRecord[]
}) {
  return (
    '<!DOCTYPE html>' +
    renderToStaticMarkup(<TransferIdPageLayout {...props} />)
  )
}
