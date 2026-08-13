import type { InteropTokenRelationsEdge } from '~/server/features/scaling/interop/token/getInteropTokenRelationsGraph'
import { cn } from '~/utils/cn'
import type { NodeBox, RelationsLayoutOrientation } from './layout'

export const ARROW_MARKER_ID = 'token-relations-arrow'
export const ARROW_MARKER_ACTIVE_ID = 'token-relations-arrow-active'

const BRIDGE_ICON_SIZE = 16
const MAX_BRIDGE_ICONS = 3

export interface RelationsEdgeGeometry {
  path: string
  midX: number
  midY: number
}

interface Props {
  geometry: RelationsEdgeGeometry
  isDimmed: boolean
  isHighlighted: boolean
}

export function RelationsEdge({ geometry, isDimmed, isHighlighted }: Props) {
  // Not interactive: what a connection means is already spelled out in the
  // panel of either deployment it touches.
  return (
    <g
      className={cn(isDimmed && 'opacity-10')}
      aria-hidden
      pointerEvents="none"
    >
      <path
        d={geometry.path}
        fill="none"
        className={isHighlighted ? 'stroke-brand' : 'stroke-primary'}
        strokeOpacity={isHighlighted ? 1 : 0.32}
        strokeWidth={isHighlighted ? 2.5 : 1.75}
        markerEnd={`url(#${isHighlighted ? ARROW_MARKER_ACTIVE_ID : ARROW_MARKER_ID})`}
      />
    </g>
  )
}

interface BridgeProps {
  edge: InteropTokenRelationsEdge
  geometry: RelationsEdgeGeometry
  isDimmed: boolean
}

export function RelationsEdgeBridges({
  edge,
  geometry,
  isDimmed,
}: BridgeProps) {
  if (edge.bridges.length === 0) return null

  return (
    <g
      className={cn(isDimmed && 'opacity-10')}
      aria-hidden
      pointerEvents="none"
    >
      <BridgeIcons bridges={edge.bridges} x={geometry.midX} y={geometry.midY} />
    </g>
  )
}

function BridgeIcons({
  bridges,
  x,
  y,
}: {
  bridges: InteropTokenRelationsEdge['bridges']
  x: number
  y: number
}) {
  const shown = bridges.slice(0, MAX_BRIDGE_ICONS)
  const extra = bridges.length - shown.length
  const step = BRIDGE_ICON_SIZE - 4
  const width = shown.length * step + (extra > 0 ? 18 : 4)

  return (
    <g transform={`translate(${x - width / 2}, ${y - BRIDGE_ICON_SIZE / 2})`}>
      <rect
        x={-4}
        y={-3}
        width={width + 8}
        height={BRIDGE_ICON_SIZE + 6}
        rx={(BRIDGE_ICON_SIZE + 6) / 2}
        className="fill-surface-primary stroke-divider"
        strokeWidth={1}
      />
      {shown.map((bridge, index) => (
        <image
          key={bridge.id}
          href={bridge.icon}
          x={index * step}
          width={BRIDGE_ICON_SIZE}
          height={BRIDGE_ICON_SIZE}
        >
          <title>{bridge.name}</title>
        </image>
      ))}
      {extra > 0 && (
        <text
          x={shown.length * step + 3}
          y={BRIDGE_ICON_SIZE - 3}
          className="fill-secondary font-bold text-label-value-12"
        >
          +{extra}
        </text>
      )}
    </g>
  )
}

/**
 * Backing connections follow the layout: rightwards in compact graphs and
 * downwards when a busy graph fans out across a wide canvas.
 *
 * Two shapes need to dodge the nodes in between rather than cut through them:
 * a connection between two nodes in the same column arcs to the left of it, and
 * one that skips a column bows above or below.
 */
export function edgeGeometry(
  from: NodeBox,
  to: NodeBox,
  columnSpan: number,
  orientation: RelationsLayoutOrientation = 'left-to-right',
  targetPort = 0.5,
) {
  if (orientation === 'top-to-bottom') {
    return verticalEdgeGeometry(from, to, columnSpan, targetPort)
  }

  if (columnSpan === 0) {
    const topFirst = from.y <= to.y
    const start = {
      x: from.x,
      y: topFirst ? from.y + from.height : from.y,
    }
    const end = { x: to.x, y: topFirst ? to.y : to.y + to.height }
    // Bows out to the left of the column, clearing anything between the two.
    const bow = Math.min(72, 24 + Math.abs(end.y - start.y) / 8)
    return {
      path: `M ${start.x} ${start.y} C ${start.x - bow} ${start.y} ${end.x - bow} ${end.y} ${end.x} ${end.y}`,
      midX: (start.x + end.x) / 2 - bow * 0.75,
      midY: (start.y + end.y) / 2,
    }
  }

  const start = { x: from.x + from.width, y: from.y + from.height / 2 }
  const end = { x: to.x, y: to.y + to.height * targetPort }

  if (columnSpan > 1) {
    // Swings clear of the column it passes, so it never runs through a node.
    const side = end.y >= start.y ? 1 : -1
    const bow = side * (SKIP_BOW + Math.abs(end.y - start.y) / 6)
    return {
      path: `M ${start.x} ${start.y} C ${start.x + 40} ${start.y + bow} ${end.x - 40} ${end.y + bow} ${end.x} ${end.y}`,
      midX: (start.x + end.x) / 2,
      midY: (start.y + end.y) / 2 + bow * 0.75,
    }
  }

  const controlX = (start.x + end.x) / 2
  return {
    path: `M ${start.x} ${start.y} C ${controlX} ${start.y} ${controlX} ${end.y} ${end.x} ${end.y}`,
    midX: controlX,
    midY: (start.y + end.y) / 2,
  }
}

function verticalEdgeGeometry(
  from: NodeBox,
  to: NodeBox,
  columnSpan: number,
  targetPort: number,
) {
  if (columnSpan === 0) {
    const leftFirst = from.x <= to.x
    const start = {
      x: leftFirst ? from.x + from.width : from.x,
      y: from.y + from.height / 2,
    }
    const end = {
      x: leftFirst ? to.x : to.x + to.width,
      y: to.y + to.height / 2,
    }
    // Bows above the row, clearing anything between the two nodes.
    const bow = Math.min(72, 24 + Math.abs(end.x - start.x) / 8)
    return {
      path: `M ${start.x} ${start.y} C ${start.x} ${start.y - bow} ${end.x} ${end.y - bow} ${end.x} ${end.y}`,
      midX: (start.x + end.x) / 2,
      midY: (start.y + end.y) / 2 - bow * 0.75,
    }
  }

  const start = { x: from.x + from.width / 2, y: from.y + from.height }
  const end = { x: to.x + to.width * targetPort, y: to.y }

  if (columnSpan > 1) {
    // Swings clear of the row it passes, so it never runs through a node.
    const side = end.x >= start.x ? 1 : -1
    const bow = side * (SKIP_BOW + Math.abs(end.x - start.x) / 6)
    return {
      path: `M ${start.x} ${start.y} C ${start.x + bow} ${start.y + 40} ${end.x + bow} ${end.y - 40} ${end.x} ${end.y}`,
      midX: end.x,
      midY: end.y - 28,
    }
  }

  const branchY = (start.y + end.y) / 2
  return {
    path: `M ${start.x} ${start.y} V ${branchY} H ${end.x} V ${end.y}`,
    midX: end.x,
    midY: branchY,
  }
}

const SKIP_BOW = 70
