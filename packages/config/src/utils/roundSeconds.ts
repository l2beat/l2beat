export function roundSeconds(seconds: number, roundingFactor: number): number {
  return Math.round(seconds / roundingFactor) * roundingFactor
}
