import { useMemo } from 'react'

export interface SvgConnection {
  from: { x: number; y: number; direction: 'left' | 'right' }
  to: { x: number; y: number; direction: 'left' | 'right' }
  isHighlighted?: boolean
  isDashed?: boolean
  isDimmed?: boolean
}

export interface ConnectionsSVGProps {
  connections: readonly SvgConnection[]
  bounds: { minX: number; minY: number; width: number; height: number }
}

/**
 * Alternative to `ConnectionsCanvas` that renders each connection as an SVG
 * <path>. This allows direct comparison of canvas vs. DOM-based rendering
 * overhead. The component receives the same `connections` array that is
 * already viewport-clipped in `NodesAndConnections`.
 */
export function ConnectionsSVG({ connections, bounds }: ConnectionsSVGProps) {
  // Memoise path list to avoid re-creating on every render unless inputs change
  const paths = useMemo(() => {
    const xOffset = -bounds.minX
    const yOffset = -bounds.minY

    return connections.map((conn) => {
      const fromCtrlX =
        conn.from.x + (conn.from.direction === 'left' ? -50 : 50)
      const toCtrlX = conn.to.x + (conn.to.direction === 'left' ? -50 : 50)

      const d = [
        'M',
        conn.from.x + xOffset,
        conn.from.y + yOffset,
        'C',
        fromCtrlX + xOffset,
        conn.from.y + yOffset,
        toCtrlX + xOffset,
        conn.to.y + yOffset,
        conn.to.x + xOffset,
        conn.to.y + yOffset,
      ].join(' ')

      const className = conn.isHighlighted
        ? 'stroke-[3] stroke-autumn-300'
        : conn.isDimmed
          ? 'stroke-2 stroke-coffee-400/30'
          : 'stroke-2 stroke-coffee-400'

      return (
        <path
          key={`${conn.from.x}-${conn.from.y}-${conn.to.x}-${conn.to.y}-${className}`}
          d={d}
          className={className}
          strokeDasharray={conn.isDashed ? '5,5' : undefined}
          strokeLinecap="round"
          fill="none"
        />
      )
    })
  }, [connections, bounds])

  if (bounds.width <= 0 || bounds.height <= 0) {
    return null
  }

  return (
    <svg
      className="pointer-events-none absolute"
      style={{
        left: bounds.minX,
        top: bounds.minY,
        width: bounds.width,
        height: bounds.height,
        zIndex: 0,
      }}
    >
      {paths}
    </svg>
  )
}
