import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { ProtocolMetrics, RadarDimension } from '../../utils/comparison'

interface ProtocolRadarChartProps {
  data: RadarDimension[]
  metrics: ProtocolMetrics[]
}

export function ProtocolRadarChart({
  data,
  metrics,
}: ProtocolRadarChartProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        Protocol Profile Comparison
      </h3>
      <p className="text-sm text-text-secondary mb-4">
        Relative comparison across key dimensions (normalized to 0-100 scale)
      </p>
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#E5E1ED" />
          <PolarAngleAxis
            dataKey="fullLabel"
            tick={{ fill: '#6B7280', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          {metrics.map((m) => (
            <Radar
              key={m.slug}
              name={m.name}
              dataKey={m.slug}
              stroke={m.color}
              fill={m.color}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #E5E1ED',
              borderRadius: '8px',
              fontSize: '13px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
