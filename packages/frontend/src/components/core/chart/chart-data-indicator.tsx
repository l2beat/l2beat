import { assertUnreachable } from '@l2beat/shared-pure'

export type ChartDataIndicatorType =
  | {
      shape: 'line'
      strokeDasharray?: string
    }
  | {
      shape: 'square'
    }

interface Props {
  type: ChartDataIndicatorType
  backgroundColor: string | undefined
}

export function ChartDataIndicator({ type, backgroundColor }: Props) {
  switch (type.shape) {
    case 'line':
      return <LineShape type={type} backgroundColor={backgroundColor} />
    case 'square':
      return <SquareShape backgroundColor={backgroundColor} />
    default:
      assertUnreachable(type)
  }
}

function SquareShape({
  backgroundColor,
}: { backgroundColor: string | undefined }) {
  return (
    <div className="size-3 shrink-0 rounded-sm" style={{ backgroundColor }} />
  )
}
function LineShape({
  type,
  backgroundColor,
}: {
  type: Extract<ChartDataIndicatorType, { shape: 'line' }>
  backgroundColor: string | undefined
}) {
  return (
    <svg width="21" height="21" viewBox="0 0 21 21" className="size-3">
      <path
        d="M0 10.5H21"
        stroke={backgroundColor}
        strokeWidth="3"
        strokeDasharray={type.strokeDasharray}
      />
    </svg>
  )
}
