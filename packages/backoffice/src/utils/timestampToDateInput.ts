export function timestampToDateInput(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 10)
}
