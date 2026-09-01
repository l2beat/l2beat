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
}

function ConnectionImpl(props: ConnectionProps) {
  const controlAX = props.fromX + (props.fromDirection === 'left' ? -50 : 50)
  const controlAY = props.fromY
  const controlBX = props.toX + (props.toDirection === 'left' ? -50 : 50)
  const controlBY = props.toY

  const d = `M ${props.fromX} ${props.fromY} C ${controlAX} ${controlAY} ${controlBX} ${controlBY} ${props.toX} ${props.toY}`

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

function toStrokeClass(
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

  return 'stroke-2 stroke-coffee-400'
}
