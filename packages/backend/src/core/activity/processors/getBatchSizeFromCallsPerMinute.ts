export function getBatchSizeFromCallsPerMinute(callsPerMinute: number): number {
  return Math.floor(callsPerMinute / 60)
}
