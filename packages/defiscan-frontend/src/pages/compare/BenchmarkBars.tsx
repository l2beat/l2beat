import {
  BarChart,
  Bar,
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

interface BenchmarkBarsProps {
  metrics: ProtocolMetrics[]
}

type MetricKey =
  | 'totalCapitalAtRisk'
  | 'adminCount'
  | 'dependencyCount'
  | 'permissionedFunctionCount'
  | 'capitalPerAdmin'

interface BenchmarkCategory {
  key: MetricKey
  title: string
  format: (v: number) => string
}

const CATEGORIES: BenchmarkCategory[] = [
  {
    key: 'totalCapitalAtRisk',
    title: 'Funds Locked',
    format: formatUsdValue,
  },
  {
    key: 'adminCount',
    title: 'Admin Count',
    format: (v) => String(Math.round(v)),
  },
  {
    key: 'dependencyCount',
    title: 'Dependencies',
    format: (v) => String(Math.round(v)),
  },
  {
    key: 'permissionedFunctionCount',
    title: 'Permissioned Functions',
    format: (v) => String(Math.round(v)),
  },
  {
    key: 'capitalPerAdmin',
    title: 'Funds per Admin',
    format: formatUsdValue,
  },
]

export function BenchmarkBars({ metrics }: BenchmarkBarsProps) {
  if (metrics.length === 0) return null

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-1">
        Benchmark Comparison
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Each protocol vs the average (dashed line)
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => {
          const avg =
            metrics.reduce((s, m) => s + m[cat.key], 0) / metrics.length
          const data = metrics.map((m) => ({
            name: m.name,
            value: m[cat.key],
            color: m.color,
          }))

          return (
            <div key={cat.key}>
              <h4 className="text-sm font-medium text-text-primary mb-2">
                {cat.title}
                <span className="ml-2 text-text-muted font-normal">
                  avg: {cat.format(avg)}
                </span>
              </h4>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E1ED"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: '#6B7280', fontSize: 11 }}
                    tickFormatter={(v: number) => cat.format(v)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      cat.format(value),
                      cat.title,
                    ]}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #E5E1ED',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                  <ReferenceLine
                    x={avg}
                    stroke="#9CA3AF"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                    {data.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}
