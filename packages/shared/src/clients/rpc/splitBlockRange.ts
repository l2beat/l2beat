import { assert } from '@l2beat/shared-pure'

/**
 * Cuts an inclusive block range into back-to-back ranges of at most `maxSize`
 * blocks. Without a limit the range is returned whole.
 */
export function splitBlockRange(
  from: number,
  to: number,
  maxSize?: number,
): [number, number][] {
  if (maxSize === undefined || to - from < maxSize) return [[from, to]]
  assert(maxSize >= 1, `Block range limit must be positive, got ${maxSize}`)

  const ranges: [number, number][] = []
  for (let start = from; start <= to; start += maxSize) {
    ranges.push([start, Math.min(start + maxSize - 1, to)])
  }
  return ranges
}
