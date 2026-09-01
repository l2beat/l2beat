export function dateInputToTimestamp(date: string): number {
  return new Date(`${date}T00:00:00Z`).getTime() / 1000
}
