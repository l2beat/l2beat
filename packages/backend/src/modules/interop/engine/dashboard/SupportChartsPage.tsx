import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type {
  InteropCoveragePieChart,
  InteropCoveragePiesData,
} from './impls/coveragePies'

function toJsonPayload(charts: InteropCoveragePieChart[]) {
  return charts.map((chart) => ({
    id: chart.id,
    labels: chart.slices.map((slice) => slice.label),
    values: chart.slices.map((slice) => slice.count),
    percentages: chart.slices.map((slice) => slice.pctOfTotal),
    colors: chart.slices.map((slice) => slice.color),
  }))
}

function formatInt(value: number): string {
  return value.toLocaleString('en-US')
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`
}

function SupportChartsPageLayout(props: InteropCoveragePiesData) {
  const jsonPayload = JSON.stringify(toJsonPayload(props.charts)).replaceAll(
    '<',
    '\\u003c',
  )

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Coverage pies</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" />
        <style>{`
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .toolbar {
            display: flex;
            gap: 12px;
            align-items: center;
            margin-bottom: 12px;
          }
          .refresh-button {
            padding: 8px 12px;
            cursor: pointer;
          }
          .meta {
            color: #475569;
            margin-bottom: 16px;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
          @media (max-width: 1200px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
          .card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 16px;
            background: #f8fafc;
          }
          .chart-container {
            height: 320px;
            position: relative;
          }
          .summary {
            margin: 6px 0 12px;
            color: #334155;
          }
          .legend {
            margin: 12px 0 0;
            padding: 0;
            list-style: none;
            font-size: 13px;
          }
          .legend li {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 4px 0;
          }
          .swatch {
            width: 10px;
            height: 10px;
            border-radius: 2px;
            flex: 0 0 10px;
          }
        `}</style>
      </head>
      <body>
        <div className="toolbar">
          <a href="/interop">← Back to Home</a>
          <button id="refreshButton" type="button" className="refresh-button">
            Refresh Data
          </button>
        </div>

        <h1>Coverage pies</h1>
        <p className="meta">
          Support source of truth: <code>InteropEvent.unsupported</code>. Slices
          below {props.collapseThresholdPct}% are collapsed by support status.
          Generated at: {props.generatedAt}
        </p>

        <div className="grid">
          {props.charts.map((chart) => (
            <section className="card" key={chart.id}>
              <h2>{chart.title}</h2>
              <p className="summary">
                All events: {formatInt(chart.totalCount)} | Supported:{' '}
                {formatInt(chart.supportedCount)} (
                {formatPct(chart.supportedPct)}) | Unsupported:{' '}
                {formatInt(chart.unsupportedCount)} (
                {formatPct(chart.unsupportedPct)})
              </p>
              <div className="chart-container">
                <canvas id={`pie-${chart.id}`} />
              </div>
              <ul className="legend">
                {chart.slices.map((slice) => (
                  <li key={`${chart.id}-${slice.label}`}>
                    <span
                      className="swatch"
                      style={{ background: slice.color }}
                    />
                    <span>
                      {slice.label} {formatPct(slice.pctOfTotal)} (
                      {formatInt(slice.count)})
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <script id="chart-data" type="application/json">
          {jsonPayload}
        </script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function () {
              var button = document.getElementById('refreshButton');
              if (button) {
                button.addEventListener('click', function () {
                  var refreshUrl = new URL(window.location.href);
                  refreshUrl.searchParams.set('refresh', '1');
                  window.location.assign(refreshUrl.toString());
                });
              }

              var payloadElement = document.getElementById('chart-data');
              var payload = [];
              if (payloadElement && payloadElement.textContent) {
                payload = JSON.parse(payloadElement.textContent);
              }

              for (let i = 0; i < payload.length; i++) {
                const chart = payload[i];
                var canvas = document.getElementById('pie-' + chart.id);
                if (!canvas) continue;
                var context = canvas.getContext('2d');
                if (!context) continue;

                new Chart(context, {
                  type: 'pie',
                  data: {
                    labels: chart.labels,
                    datasets: [
                      {
                        data: chart.values,
                        backgroundColor: chart.colors,
                        borderColor: '#ffffff',
                        borderWidth: 1,
                      },
                    ],
                  },
                  options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: function (ctx) {
                            var value = chart.values[ctx.dataIndex];
                            var pct = chart.percentages[ctx.dataIndex];
                            return value.toLocaleString('en-US') + ' (' + pct.toFixed(2) + '%)';
                          },
                        },
                      },
                    },
                  },
                });
              }
            })();
          `,
          }}
        />
      </body>
    </html>
  )
}

export function renderSupportChartsPage(props: InteropCoveragePiesData) {
  return (
    '<!DOCTYPE html>' +
    renderToStaticMarkup(<SupportChartsPageLayout {...props} />)
  )
}
