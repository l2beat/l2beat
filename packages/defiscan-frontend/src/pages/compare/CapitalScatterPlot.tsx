import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'
import type { ProtocolMetrics } from '../../utils/comparison'
import { formatUsdValue } from '../../utils/format'

interface CapitalScatterPlotProps {
  metrics: ProtocolMetrics[]
  xKey: 'adminCount' | 'dependencyCount' | 'contractCount'
  xLabel: string
}

export function CapitalScatterPlot({
  metrics,
  xKey,
  xLabel,
}: CapitalScatterPlotProps) {
  const data = metrics.map((m) => ({
    x: m[xKey],
    y: m.totalCapitalAtRisk,
    name: m.name,
    color: m.color,
  }))

  const avgX = data.reduce((s, d) => s + d.x, 0) / (data.length || 1)
  const avgY = data.reduce((s, d) => s + d.y, 0) / (data.length || 1)

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        TVL vs {xLabel}
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        Dashed lines show averages across all protocols
      </p>
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1ED" />
          <XAxis
            type="number"
            dataKey="x"
            name={xLabel}
            tick={{ fill: '#6B7280', fontSize: 12 }}
            label={{
              value: xLabel,
              position: 'bottom',
              offset: 0,
              style: { fill: '#6B7280', fontSize: 12 },
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="TVL"
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickFormatter={(v: number) => formatUsdValue(v)}
          />
          <Tooltip
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null
              const p = payload[0]?.payload as (typeof data)[number] | undefined
              if (!p) return null
              return (
                <div className="rounded-lg border border-border bg-white p-3 shadow-md text-sm">
                  <p className="font-semibold text-text-primary">{p.name}</p>
                  <p className="text-text-secondary">
                    {xLabel}: {p.x}
                  </p>
                  <p className="text-capital font-medium">
                    Capital: {formatUsdValue(p.y)}
                  </p>
                </div>
              )
            }}
          />
          <ReferenceLine
            x={avgX}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            strokeWidth={1}
          />
          <ReferenceLine
            y={avgY}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            strokeWidth={1}
          />
          <Scatter data={data}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={entry.color} r={8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
