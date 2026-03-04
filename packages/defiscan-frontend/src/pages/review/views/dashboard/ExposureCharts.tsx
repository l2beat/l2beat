import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Treemap,
} from 'recharts'
import { formatUsdValue } from '../../../../utils/format'
import type { CompiledReview } from '../../../../types'

interface ExposureChartsProps {
  review: CompiledReview
}

const ADMIN_TYPE_COLORS: Record<string, string> = {
  EOA: '#EF4444',
  EOAPermissioned: '#EF4444',
  Multisig: '#F59E0B',
  Timelock: '#10B981',
  Contract: '#3B82F6',
  Upgradeable: '#3B82F6',
  Revoked: '#10B981',
  Immutable: '#10B981',
  Untemplatized: '#6B7280',
  Diamond: '#3B82F6',
}

interface TreemapContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  value?: number
  color?: string
}

function TreemapContent({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  value,
  color,
}: TreemapContentProps) {
  if (width < 50 || height < 35) return null
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={2}
        rx={4}
        fillOpacity={0.15}
      />
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        rx={4}
        strokeOpacity={0.4}
      />
      <text
        x={x + 8}
        y={y + 18}
        fill="#1E1B2E"
        fontSize={12}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight={600}
      >
        {name && name.length > 18 ? name.slice(0, 18) + '...' : name}
      </text>
      {height > 45 && (
        <text
          x={x + 8}
          y={y + 34}
          fill="#6B7280"
          fontSize={11}
          fontFamily="Inter, system-ui, sans-serif"
        >
          {formatUsdValue(value ?? 0)}
        </text>
      )}
    </g>
  )
}

export function ExposureCharts({ review }: ExposureChartsProps) {
  // Treemap: admin capital distribution
  const treemapData = useMemo(() => {
    return review.admins
      .filter((a) => a.totalDirectCapital > 0 || a.totalDirectTokenValue > 0)
      .map((a) => ({
        name: a.name,
        value: a.totalDirectCapital + a.totalDirectTokenValue,
        color: ADMIN_TYPE_COLORS[a.adminType] ?? '#6B7280',
      }))
      .sort((a, b) => b.value - a.value)
  }, [review.admins])

  // Pie chart: admin type distribution
  const adminTypePieData = useMemo(() => {
    const typeMap = new Map<string, number>()
    for (const admin of review.admins) {
      const existing = typeMap.get(admin.adminType) ?? 0
      typeMap.set(admin.adminType, existing + 1)
    }
    return Array.from(typeMap.entries()).map(([type, count]) => ({
      name: type,
      value: count,
      fill: ADMIN_TYPE_COLORS[type] ?? '#6B7280',
    }))
  }, [review.admins])

  // Bar chart: capital per admin
  const adminCapitalData = useMemo(() => {
    return review.admins
      .filter((a) => a.totalDirectCapital > 0 || a.totalDirectTokenValue > 0)
      .map((a) => ({
        name: a.name.length > 22 ? a.name.slice(0, 22) + '...' : a.name,
        capital: a.totalDirectCapital,
        tokenValue: a.totalDirectTokenValue,
        type: a.adminType,
      }))
      .sort((a, b) => b.capital + b.tokenValue - (a.capital + a.tokenValue))
  }, [review.admins])

  const hasTreemapData = treemapData.length > 0
  const hasAdminCapital = adminCapitalData.length > 0
  const hasPieData = adminTypePieData.length > 0

  if (!hasTreemapData && !hasAdminCapital && !hasPieData) {
    return (
      <div className="rounded-xl border border-border bg-white p-8 text-center">
        <p className="text-sm text-text-muted">
          No funds distribution data available.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-text-primary">
        Funds Distribution
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Treemap: admin capital distribution */}
        {hasTreemapData && (
          <div className="lg:col-span-2 rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-5 py-3">
              <h4 className="text-sm font-semibold text-text-primary">
                Admin Funds Treemap
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Size proportional to funds under control
              </p>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={240}>
                <Treemap
                  data={treemapData}
                  dataKey="value"
                  nameKey="name"
                  content={<TreemapContent />}
                />
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pie chart: admin type distribution */}
        {hasPieData && (
          <div className="rounded-xl border border-border bg-white shadow-sm">
            <div className="border-b border-border px-5 py-3">
              <h4 className="text-sm font-semibold text-text-primary">
                Admin Types
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Distribution by admin category
              </p>
            </div>
            <div className="p-4 flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={adminTypePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={65}
                    dataKey="value"
                    nameKey="name"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  >
                    {adminTypePieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      const d = payload[0]
                      if (!d) return null
                      return (
                        <div className="rounded-lg border border-border bg-white px-3 py-2 text-sm shadow-lg">
                          <div className="font-medium text-text-primary">
                            {d.name}
                          </div>
                          <div className="text-text-secondary tabular-nums">
                            {d.value} admin{Number(d.value) !== 1 ? 's' : ''}
                          </div>
                        </div>
                      )
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 justify-center">
                {adminTypePieData.map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center gap-1.5 text-xs text-text-secondary"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-sm"
                      style={{ backgroundColor: t.fill }}
                    />
                    {t.name} ({t.value})
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bar chart: capital per admin */}
      {hasAdminCapital && (
        <div className="rounded-xl border border-border bg-white shadow-sm">
          <div className="border-b border-border px-5 py-3">
            <h4 className="text-sm font-semibold text-text-primary">
              Funds by Admin
            </h4>
            <p className="text-xs text-text-muted mt-0.5">
              Direct funds and protocol token value controlled per admin
            </p>
          </div>
          <div className="p-4">
            <ResponsiveContainer
              width="100%"
              height={Math.max(140, adminCapitalData.length * 44)}
            >
              <BarChart
                data={adminCapitalData}
                layout="vertical"
                margin={{ left: 120, right: 20, top: 5, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 11,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fill: '#6B7280',
                  }}
                  tickFormatter={(v: number) => formatUsdValue(v)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fill: '#1E1B2E',
                  }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E1ED',
                    borderRadius: 8,
                    fontSize: 12,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: '#1E1B2E', fontWeight: 600 }}
                  formatter={(v: number) => formatUsdValue(v)}
                />
                <Bar
                  dataKey="capital"
                  name="Funds"
                  stackId="a"
                  radius={[0, 2, 2, 0]}
                >
                  {adminCapitalData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={ADMIN_TYPE_COLORS[entry.type] ?? '#6B7280'}
                      fillOpacity={0.7}
                    />
                  ))}
                </Bar>
                <Bar
                  dataKey="tokenValue"
                  name="Protocol Token Value"
                  stackId="a"
                  radius={[0, 2, 2, 0]}
                >
                  {adminCapitalData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={ADMIN_TYPE_COLORS[entry.type] ?? '#6B7280'}
                      fillOpacity={0.3}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
