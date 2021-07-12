export function calculateTicks(ticks: number, min: number, max: number) {
  const baseRange = max - min
  const newMin = Math.max(0, min - baseRange * 0.05)
  const newMax = max + baseRange * 0.05
  const range = newMax - newMin
  const tick = range / (ticks - 1)
  return new Array(ticks).fill(0).map((_, i) => newMin + tick * i)
}
