import { Connection, type ConnectionProps } from '../panel-nodes/view/Connection'

export interface ClickableConnectionProps extends ConnectionProps {
  hasCallGraphData?: boolean
  onClick?: (e: React.MouseEvent<SVGPathElement>) => void
}

/**
 * Wrapper component that adds click functionality to Connection for edges with call graph data.
 * This follows the Minimal Integration Principle - keeping DefidDisco-specific code in /defidisco/.
 */
export function ClickableConnection({
  hasCallGraphData,
  onClick,
  from,
  to,
  isDashed,
  ...rest
}: ClickableConnectionProps) {
  // Calculate the bezier curve path (same logic as Connection)
  const controlA = {
    x: from.x + (from.direction === 'left' ? -50 : 50),
    y: from.y,
  }

  const controlB = {
    x: to.x + (to.direction === 'left' ? -50 : 50),
    y: to.y,
  }

  const d = [
    'M',
    from.x,
    from.y,
    'C',
    controlA.x,
    controlA.y,
    controlB.x,
    controlB.y,
    to.x,
    to.y,
  ].join(' ')

  return (
    <g>
      {/* Invisible hitbox for clickable edges with call graph data */}
      {hasCallGraphData && (
        <path
          d={d}
          stroke="transparent"
          strokeWidth={16}
          strokeLinecap="round"
          pointerEvents="stroke"
          className="cursor-pointer"
          onClick={onClick}
        />
      )}
      {/* Visible connection path - use custom styling for edges with call graph data */}
      {hasCallGraphData ? (
        <path
          d={d}
          strokeLinecap="round"
          strokeDasharray={isDashed ? '5,5' : undefined}
          className={toCallGraphStrokeClass(rest)}
          pointerEvents="none"
        />
      ) : (
        <Connection from={from} to={to} isDashed={isDashed} {...rest} />
      )}
    </g>
  )
}

/**
 * Custom stroke class function for edges with call graph data.
 * Uses flashier cyan color to indicate interactivity.
 */
function toCallGraphStrokeClass(
  props: Pick<ConnectionProps, 'isHighlighted' | 'isDimmed' | 'isGrayedOut'>,
) {
  if (props.isHighlighted) {
    return 'stroke-[3] stroke-autumn-300'
  }

  if (props.isGrayedOut) {
    return 'stroke-2 stroke-coffee-200/10'
  }

  if (props.isDimmed) {
    return 'stroke-2 stroke-coffee-400/30'
  }

  // Flashy cyan color for edges with call graph data
  return 'stroke-[3] stroke-aux-cyan'
}
