import { SimpleDate } from '../types'

export function dateRange(start: SimpleDate, end: SimpleDate) {
  let current = start
  const result = []
  while (current.isBefore(end)) {
    result.push(current)
    current = current.addDays(1)
  }
  return result
}
