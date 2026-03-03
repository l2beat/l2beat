import type { InteropEventSupportBreakdownRecord } from '@l2beat/database'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const COLLAPSE_THRESHOLD_PCT = 2

const CHAIN_ALIASES: Record<string, string> = {
  Unknown_792703809: 'solana',
  Unknown_30367: 'hyperliquid',
  Unknown_30383: 'plasma',
  Unknown_30385: 'dinari',
  Unknown_30390: 'monad',
  Unknown_30396: 'stable',
  Unknown_30292: 'etherlink',
  Unknown_30403: 'citrea',
  Unknown_30420: 'tron',
  Unknown_30362: 'berachain',
}

interface AggregatedSlice {
  label: string
  rawChains: string[]
  isSupported: boolean
  count: number
  pctOfTotal: number
  color: string
}

interface EventSupportChart {
  id: string
  title: string
  centerLabel: string
  totalCount: number
  supportedCount: number
  unsupportedCount: number
  supportedPct: number
  unsupportedPct: number
  slices: AggregatedSlice[]
}

interface ChartInput {
  id: string
  title: string
  centerLabel: string
  rows: InteropEventSupportBreakdownRecord[]
}

function resolveChainAlias(chain: string): string {
  return CHAIN_ALIASES[chain] ?? chain
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h} ${s}% ${l}%)`
}

function addColors(rows: Omit<AggregatedSlice, 'color'>[]): AggregatedSlice[] {
  const supported = rows.filter((r) => r.isSupported)
  const unsupported = rows.filter((r) => !r.isSupported)

  let supportedIndex = 0
  let unsupportedIndex = 0

  return rows.map((row) => {
    if (row.isSupported) {
      const t =
        supported.length <= 1 ? 0.5 : supportedIndex / (supported.length - 1)
      supportedIndex++
      return { ...row, color: hsl(136, 65, 30 + t * 40) }
    }

    const t =
      unsupported.length <= 1
        ? 0.5
        : unsupportedIndex / (unsupported.length - 1)
    unsupportedIndex++
    return { ...row, color: hsl(0, 75, 30 + t * 40) }
  })
}

function buildChartData(input: ChartInput): EventSupportChart {
  const grouped = new Map<
    string,
    {
      count: number
      supportedCount: number
      unsupportedCount: number
      rawChains: Set<string>
    }
  >()

  for (const row of input.rows) {
    const label = resolveChainAlias(row.chain)
    const current = grouped.get(label) ?? {
      count: 0,
      supportedCount: 0,
      unsupportedCount: 0,
      rawChains: new Set<string>(),
    }

    current.count += row.count
    if (row.isSupported) {
      current.supportedCount += row.count
    } else {
      current.unsupportedCount += row.count
    }
    current.rawChains.add(row.chain)
    grouped.set(label, current)
  }

  const merged = Array.from(grouped.entries())
    .map(([label, value]) => ({
      label,
      rawChains: Array.from(value.rawChains).sort(),
      count: value.count,
      isSupported: value.unsupportedCount === 0,
    }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  const totalCount = merged.reduce((acc, row) => acc + row.count, 0)

  const withPct = merged.map((row) => ({
    ...row,
    pctOfTotal: totalCount === 0 ? 0 : (100 * row.count) / totalCount,
  }))

  const large = withPct.filter((x) => x.pctOfTotal >= COLLAPSE_THRESHOLD_PCT)
  const small = withPct.filter((x) => x.pctOfTotal < COLLAPSE_THRESHOLD_PCT)

  const smallSupported = small.filter((x) => x.isSupported)
  const smallUnsupported = small.filter((x) => !x.isSupported)

  const collapsed: Omit<AggregatedSlice, 'color'>[] = [...large]

  if (smallSupported.length > 0) {
    const count = smallSupported.reduce((acc, row) => acc + row.count, 0)
    collapsed.push({
      label: `Other supported (<${COLLAPSE_THRESHOLD_PCT}%, ${smallSupported.length} chains)`,
      rawChains: smallSupported.flatMap((x) => x.rawChains),
      isSupported: true,
      count,
      pctOfTotal: totalCount === 0 ? 0 : (100 * count) / totalCount,
    })
  }

  if (smallUnsupported.length > 0) {
    const count = smallUnsupported.reduce((acc, row) => acc + row.count, 0)
    collapsed.push({
      label: `Other unsupported (<${COLLAPSE_THRESHOLD_PCT}%, ${smallUnsupported.length} chains)`,
      rawChains: smallUnsupported.flatMap((x) => x.rawChains),
      isSupported: false,
      count,
      pctOfTotal: totalCount === 0 ? 0 : (100 * count) / totalCount,
    })
  }

  const slices = addColors(
    collapsed.sort(
      (a, b) => b.count - a.count || a.label.localeCompare(b.label),
    ),
  )

  const supportedCount = slices
    .filter((x) => x.isSupported)
    .reduce((acc, row) => acc + row.count, 0)
  const unsupportedCount = totalCount - supportedCount

  return {
    id: input.id,
    title: input.title,
    centerLabel: input.centerLabel,
    totalCount,
    supportedCount,
    unsupportedCount,
    supportedPct: totalCount === 0 ? 0 : (100 * supportedCount) / totalCount,
    unsupportedPct:
      totalCount === 0 ? 0 : (100 * unsupportedCount) / totalCount,
    slices,
  }
}

function toJsonPayload(charts: EventSupportChart[]) {
  return charts.map((chart) => ({
    id: chart.id,
    labels: chart.slices.map((x) => x.label),
    values: chart.slices.map((x) => x.count),
    percentages: chart.slices.map((x) => x.pctOfTotal),
    colors: chart.slices.map((x) => x.color),
  }))
}

function formatInt(value: number): string {
  return value.toLocaleString('en-US')
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`
}

function SupportChartsPageLayout(props: {
  charts: EventSupportChart[]
  generatedAt: string
}) {
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
          below {COLLAPSE_THRESHOLD_PCT}% are collapsed by support status.
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

export function renderSupportChartsPage(props: { charts: ChartInput[] }) {
  const charts = props.charts.map((chart) => buildChartData(chart))

  return (
    '<!DOCTYPE html>' +
    renderToStaticMarkup(
      <SupportChartsPageLayout
        charts={charts}
        generatedAt={new Date().toISOString()}
      />,
    )
  )
}
