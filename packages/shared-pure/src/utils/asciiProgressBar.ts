export const EMPTY = '░'
export const FILLED = '█'

export function asciiProgressBar(
  current: number,
  total: number,
  width = 40,
): string {
  const currentClamped = Math.max(0, Math.min(current, total))
  const filled = Math.round((currentClamped / total) * width)
  const empty = width - filled
  return `${FILLED.repeat(filled)}${EMPTY.repeat(empty)}`
}
