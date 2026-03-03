import type { CompiledDependency } from '../../../../../types'

interface DependencyRiskDiagramProps {
  dependencies: CompiledDependency[]
}

export function DependencyRiskDiagram({ dependencies }: DependencyRiskDiagramProps) {
  // Group dependencies by entity
  const entityMap = new Map<string, number>()
  let untaggedCount = 0
  for (const dep of dependencies) {
    if (dep.entity) {
      entityMap.set(dep.entity, (entityMap.get(dep.entity) ?? 0) + 1)
    } else {
      untaggedCount++
    }
  }

  const entities = Array.from(entityMap.entries())
    .sort((a, b) => b[1] - a[1])

  if (dependencies.length === 0) {
    return (
      <div className="text-center text-text-muted text-sm py-4">
        No external dependencies detected.
      </div>
    )
  }

  // Assign colors to entities
  const entityColors = [
    '#FB923C', '#F59E0B', '#EF4444', '#8B5CF6',
    '#3B82F6', '#10B981', '#EC4899', '#6366F1',
  ]

  const allEntries = [
    ...entities.map(([name, count], i) => ({
      name,
      count,
      color: entityColors[i % entityColors.length],
    })),
    ...(untaggedCount > 0
      ? [{ name: 'Untagged', count: untaggedCount, color: '#9CA3AF' }]
      : []),
  ]

  const totalDeps = dependencies.length

  // Layout
  const leftMargin = 130
  const barAreaWidth = 400
  const barHeight = 24
  const rowHeight = 40
  const topPadding = 30
  const svgWidth = leftMargin + barAreaWidth + 80
  const svgHeight = topPadding + allEntries.length * rowHeight + 60

  const maxCount = Math.max(...allEntries.map((e) => e.count))

  function barWidth(count: number): number {
    if (maxCount === 0) return 0
    return (count / maxCount) * barAreaWidth
  }

  // Concentration metric: Herfindahl index
  const hhi = allEntries.reduce((sum, e) => {
    const share = e.count / totalDeps
    return sum + share * share
  }, 0)
  const concentrationLabel =
    hhi > 0.5
      ? 'High concentration'
      : hhi > 0.25
        ? 'Moderate concentration'
        : 'Diversified'
  const concentrationColor =
    hhi > 0.5 ? '#EF4444' : hhi > 0.25 ? '#F59E0B' : '#10B981'

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="w-full"
      style={{ maxHeight: `${Math.min(svgHeight, 400)}px` }}
    >
      {/* Title area */}
      <text x={leftMargin} y={16} fill="#6B7280" fontSize="10" fontWeight="600">
        DEPENDENCY CONTRACTS PER ENTITY
      </text>

      {/* Concentration indicator */}
      <circle cx={svgWidth - 100} cy={12} r={5} fill={concentrationColor} />
      <text x={svgWidth - 90} y={16} fill={concentrationColor} fontSize="9" fontWeight="600">
        {concentrationLabel}
      </text>

      {/* Bars */}
      {allEntries.map((entry, i) => {
        const y = topPadding + i * rowHeight
        const w = barWidth(entry.count)
        const pct = ((entry.count / totalDeps) * 100).toFixed(0)

        return (
          <g key={entry.name}>
            {/* Entity name */}
            <text
              x={leftMargin - 10}
              y={y + barHeight / 2 + 4}
              textAnchor="end"
              fill="#374151"
              fontWeight="500"
              fontSize="11"
            >
              {entry.name.length > 18 ? `${entry.name.slice(0, 16)}...` : entry.name}
            </text>

            {/* Bar */}
            <rect
              x={leftMargin}
              y={y}
              width={Math.max(w, 4)}
              height={barHeight}
              rx={4}
              fill={entry.color}
              opacity={0.8}
            />

            {/* Count label */}
            <text
              x={leftMargin + w + 8}
              y={y + barHeight / 2 + 4}
              fill="#374151"
              fontSize="10"
              fontWeight="600"
            >
              {entry.count}
            </text>

            {/* Percentage */}
            <text
              x={leftMargin + w + 30}
              y={y + barHeight / 2 + 4}
              fill="#9CA3AF"
              fontSize="9"
            >
              ({pct}%)
            </text>
          </g>
        )
      })}

      {/* Bottom legend */}
      <g transform={`translate(${leftMargin}, ${svgHeight - 30})`}>
        <text fill="#6B7280" fontSize="9">
          Total: {totalDeps} dependencies across {entityMap.size} entit{entityMap.size !== 1 ? 'ies' : 'y'}
          {untaggedCount > 0 ? ` + ${untaggedCount} untagged` : ''}
        </text>
        <text y={14} fill="#9CA3AF" fontSize="9">
          Higher concentration = greater single-point-of-failure risk
        </text>
      </g>
    </svg>
  )
}
