export function formatProcessorTimestamp(timestamp: number) {
  return new Date(timestamp * 1000).toUTCString()
}
