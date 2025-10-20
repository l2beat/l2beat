export interface ConnectionProps {
  from: { x: number; y: number; direction: 'left' | 'right' }
  to: { x: number; y: number; direction: 'left' | 'right' }
  isHighlighted?: boolean
  isDashed?: boolean
  isDimmed?: boolean
  isGrayedOut?: boolean
}

export function Connection({ from, to, isDashed, ...rest }: ConnectionProps) {
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
    <path
      d={d}
      strokeLinecap="round"
      strokeDasharray={isDashed ? '5,5' : undefined}
      className={toStrokeClass(rest)}
    />
  )
}

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
