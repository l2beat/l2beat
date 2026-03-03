import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { ProtocolMetrics } from '../../utils/comparison'

interface AdminTypeChartProps {
  metrics: ProtocolMetrics[]
}

export function AdminTypeChart({ metrics }: AdminTypeChartProps) {
  const data = metrics.map((m) => ({
    name: m.name,
    EOA: m.eoaAdminCount,
    Multisig: m.multisigAdminCount,
    Contract: m.contractAdminCount,
    Timelock: m.timelockAdminCount,
    Revoked: m.revokedAdminCount,
  }))

  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Admin Type Distribution
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        Breakdown of admin types per protocol
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 20, bottom: 5, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E1ED" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: '#6B7280', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E1ED',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Bar
            dataKey="EOA"
            stackId="a"
            fill="#EF4444"
            radius={[0, 0, 0, 0]}
          />
          <Bar dataKey="Multisig" stackId="a" fill="#F59E0B" />
          <Bar dataKey="Contract" stackId="a" fill="#3B82F6" />
          <Bar dataKey="Timelock" stackId="a" fill="#10B981" />
          <Bar
            dataKey="Revoked"
            stackId="a"
            fill="#6B7280"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
