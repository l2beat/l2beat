export function formatEventTimestamp(timestamp: number) {
  return `${toCsvIsoTimestamp(timestamp).slice(0, 19).replace('T', ' ')}`
}

export function toCsvIsoTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toISOString()
}
