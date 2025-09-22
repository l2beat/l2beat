export interface ConnectionProps {
  from: { x: number; y: number; direction: 'left' | 'right' }
  to: { x: number; y: number; direction: 'left' | 'right' }
  isHighlighted?: boolean
  isDashed?: boolean
  isDimmed?: boolean
}

export function Connection({
  from,
  to,
  isHighlighted,
  isDashed,
  isDimmed,
}: ConnectionProps) {
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
      className={
        isHighlighted
          ? 'stroke-[3] stroke-autumn-300'
          : isDimmed
            ? 'stroke-2 stroke-coffee-400/30'
            : 'stroke-2 stroke-coffee-400'
      }
    />
  )
}
