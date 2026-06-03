import { cn } from '~/utils/cn'
import type { RosetteValue } from '../types'
import { GrissiniStick } from './GrissiniStick'

interface Props {
  values: RosetteValue[]
  className?: string
}

const EMPTY: RosetteValue = { name: '', value: '' }
const EMPTY_GRISSINI = [EMPTY, EMPTY, EMPTY]

export function GrissiniIcon({ values, className }: Props) {
  const hasNoBridge = values.length === 0
  const display = hasNoBridge ? EMPTY_GRISSINI : values

  return (
    <div
      className={cn(
        'flex flex-row items-center justify-center gap-1',
        className,
      )}
    >
      {display.map((value, i) => (
        <GrissiniStick
          sentiment={
            hasNoBridge ? 'UnderReview' : (value.sentiment ?? 'neutral')
          }
          key={i}
        />
      ))}
      {hasNoBridge && (
        <div className="absolute flex items-center justify-center">
          <ExclamationIcon />
        </div>
      )}
    </div>
  )
}

function ExclamationIcon() {
  return (
    <svg width="6" height="24" viewBox="0 0 6 24" fill="none">
      <path d="M3 24a3 3 0 100-6 3 3 0 000 6" fill="#FF0000" />
      <path
        d="M5.334 0H.667a.667.667 0 00-.666.695L.667 16.03a.666.666 0 00.667.638h3.333a.667.667 0 00.667-.638L6 .695A.667.667 0 005.334 0"
        fill="#FF0000"
      />
    </svg>
  )
}
