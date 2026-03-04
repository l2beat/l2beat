import type { CompiledAdmin } from '../../../../../types'
import { formatUsdValue } from '../../../../../utils/format'
import { adminTypeColor } from '../../../../../utils/colors'

interface DirectVsReachableDiagramProps {
  admins: CompiledAdmin[]
}

export function DirectVsReachableDiagram({ admins }: DirectVsReachableDiagramProps) {
  // Filter admins that have any capital and sort by direct capital
  const withCapital = admins
    .filter((a) => a.totalDirectCapital > 0 || a.totalReachableCapital > 0)
    .sort((a, b) => b.totalDirectCapital - a.totalDirectCapital)
    .slice(0, 8)

  if (withCapital.length === 0) {
    return (
      <div className="text-center text-text-muted text-sm py-4">
        No admin funds data available.
      </div>
    )
  }

  // Find max value for scaling
  const maxValue = Math.max(
    ...withCapital.map((a) => Math.max(a.totalDirectCapital, a.totalReachableCapital)),
  )

  // Layout constants
  const leftMargin = 160
  const rightMargin = 20
  const barAreaWidth = 500
  const barHeight = 16
  const rowHeight = 50
  const topPadding = 30
  const svgWidth = leftMargin + barAreaWidth + rightMargin
  const svgHeight = topPadding + withCapital.length * rowHeight + 30

  function barWidth(value: number): number {
    if (maxValue === 0) return 0
    return (value / maxValue) * barAreaWidth
  }

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full"
      style={{ maxHeight: `${Math.min(svgHeight, 460)}px` }}
    >
      {/* Header */}
      <text x={leftMargin} y={16} fill="#6B7280" fontSize="9" fontWeight="600">
        DIRECT CAPITAL
      </text>
      <rect x={leftMargin - 14} y={8} width="10" height="10" rx="2" fill="#10B981" />
      <text x={leftMargin + 90} y={16} fill="#6B7280" fontSize="9" fontWeight="600">
        REACHABLE CAPITAL
      </text>
      <rect x={leftMargin + 76} y={8} width="10" height="10" rx="2" fill="#10B981" opacity={0.35} />

      {withCapital.map((admin, i) => {
        const y = topPadding + i * rowHeight
        const color = adminTypeColor(admin.adminType)
        const directW = barWidth(admin.totalDirectCapital)
        const reachableW = barWidth(admin.totalReachableCapital)

        return (
          <g key={admin.address}>
            {/* Admin name */}
            <text
              x={leftMargin - 8}
              y={y + 12}
              textAnchor="end"
              fill="#374151"
              fontWeight="500"
              fontSize="11"
            >
              {admin.name.length > 20 ? `${admin.name.slice(0, 18)}...` : admin.name}
            </text>
            {/* Admin type label */}
            <text
              x={leftMargin - 8}
              y={y + 26}
              textAnchor="end"
              fill={color}
              fontSize="9"
              fontWeight="500"
            >
              {admin.adminType}
            </text>

            {/* Direct capital bar */}
            <rect
              x={leftMargin}
              y={y + 3}
              width={Math.max(directW, 2)}
              height={barHeight}
              rx={3}
              fill="#10B981"
            />
            {admin.totalDirectCapital > 0 && (
              <text
                x={leftMargin + directW + 6}
                y={y + 3 + barHeight / 2 + 4}
                fill="#10B981"
                fontSize="9"
                fontWeight="600"
              >
                {formatUsdValue(admin.totalDirectCapital)}
              </text>
            )}

            {/* Reachable capital bar (below direct) */}
            <rect
              x={leftMargin}
              y={y + 3 + barHeight + 4}
              width={Math.max(reachableW, 2)}
              height={barHeight}
              rx={3}
              fill="#10B981"
              opacity={0.35}
            />
            {admin.totalReachableCapital > 0 && (
              <text
                x={leftMargin + reachableW + 6}
                y={y + 3 + barHeight + 4 + barHeight / 2 + 4}
                fill="#6B7280"
                fontSize="9"
              >
                {formatUsdValue(admin.totalReachableCapital)}
              </text>
            )}
          </g>
        )
      })}

      {/* Key distinction note */}
      <g transform={`translate(${leftMargin}, ${svgHeight - 22})`}>
        <text fill="#9CA3AF" fontSize="9">
          Direct = funds held in the modified contract | Reachable = downstream impactable contracts
        </text>
      </g>
    </svg>
  )
}
