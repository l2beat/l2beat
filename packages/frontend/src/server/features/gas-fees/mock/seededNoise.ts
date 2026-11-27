/**
 * A number in [0, 1) that depends only on its keys, so mock data is the same
 * on every request and for every range that includes a day
 */
export function seededNoise(...keys: (string | number)[]): number {
  let h = 2166136261
  for (const char of keys.join('|')) {
    h = Math.imul(h ^ char.charCodeAt(0), 16777619)
  }
  h = Math.imul(h ^ (h >>> 15), 2246822507)
  h = Math.imul(h ^ (h >>> 13), 3266489909)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296
}

/** `value` moved by up to ±`spread`, as a share of it */
export function jitter(
  value: number,
  spread: number,
  ...keys: (string | number)[]
) {
  return value * (1 + (seededNoise(...keys) * 2 - 1) * spread)
}
