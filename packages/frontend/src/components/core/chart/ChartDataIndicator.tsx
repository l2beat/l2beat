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
}: {
  backgroundColor: string | undefined
}) {
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
    <svg
      width="12"
      height="4"
      viewBox="0 0 12 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 2H12"
        stroke={backgroundColor}
        strokeWidth="4"
        strokeDasharray={type.strokeDasharray ? '5 2' : undefined}
        className="rounded-[1px]"
      />
    </svg>
  )
}
