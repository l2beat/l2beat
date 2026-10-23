import { memo } from 'react'

export interface ConnectionProps {
  fromX: number
  fromY: number
  fromDirection: 'left' | 'right'
  toX: number
  toY: number
  toDirection: 'left' | 'right'
  isHighlighted?: boolean
  isDashed?: boolean
  isDimmed?: boolean
  isGrayedOut?: boolean
  // Permission edges carry their role's color and point at their target.
  color?: string
}

const ARROW_LENGTH = 9
const ARROW_HALF_WIDTH = 4.5

function ConnectionImpl(props: ConnectionProps) {
  const controlAX = props.fromX + (props.fromDirection === 'left' ? -50 : 50)
  const controlAY = props.fromY
  const controlBX = props.toX + (props.toDirection === 'left' ? -50 : 50)
  const controlBY = props.toY

  const d = `M ${props.fromX} ${props.fromY} C ${controlAX} ${controlAY} ${controlBX} ${controlBY} ${props.toX} ${props.toY}`

  if (props.color !== undefined) {
    return <ColoredConnection {...props} color={props.color} d={d} />
  }

  return (
    <path
      d={d}
      strokeLinecap="round"
      strokeDasharray={props.isDashed ? '5,5' : undefined}
      className={toStrokeClass(props)}
    />
  )
}

export const Connection = memo(ConnectionImpl)

// The curve ends level with its target's side, so the head points straight
// into the node from whichever side the curve arrives.
function ColoredConnection(
  props: ConnectionProps & { color: string; d: string },
) {
  const tipX = props.toX
  const baseX =
    props.toDirection === 'left' ? tipX - ARROW_LENGTH : tipX + ARROW_LENGTH
  const head = `M ${tipX} ${props.toY} L ${baseX} ${props.toY - ARROW_HALF_WIDTH} L ${baseX} ${props.toY + ARROW_HALF_WIDTH} Z`
  return (
    <g opacity={toOpacity(props)}>
      <path
        d={props.d}
        stroke={props.color}
        strokeWidth={props.isHighlighted ? 3.5 : 2}
        strokeLinecap="round"
        strokeDasharray={props.isDashed ? '7,5' : undefined}
      />
      <path d={head} fill={props.color} />
    </g>
  )
}

function toOpacity(
  props: Pick<ConnectionProps, 'isHighlighted' | 'isDimmed' | 'isGrayedOut'>,
) {
  if (props.isHighlighted) {
    return 1
  }
  if (props.isGrayedOut) {
    return 0.1
  }
  if (props.isDimmed) {
    return 0.2
  }
  return 0.85
}

function toStrokeClass(
  props: Pick<ConnectionProps, 'isHighlighted' | 'isDimmed' | 'isGrayedOut'>,
) {
  if (props.isHighlighted) {
    return 'stroke-3 stroke-autumn-300'
  }

  if (props.isGrayedOut) {
    return 'stroke-2 stroke-coffee-200/10'
  }

  if (props.isDimmed) {
    return 'stroke-2 stroke-coffee-400/30'
  }

  return 'stroke-2 stroke-coffee-400'
}
