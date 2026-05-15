export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ')
}
