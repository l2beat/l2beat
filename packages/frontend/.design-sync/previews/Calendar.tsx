import { Calendar } from '@l2beat/frontend'

const MONTH = new Date(2026, 7, 1)

export function SingleDate() {
  return (
    <Calendar
      mode="single"
      defaultMonth={MONTH}
      selected={new Date(2026, 7, 20)}
    />
  )
}

export function DateRange() {
  return (
    <Calendar
      mode="range"
      defaultMonth={MONTH}
      selected={{ from: new Date(2026, 7, 10), to: new Date(2026, 7, 20) }}
    />
  )
}
