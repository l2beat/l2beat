/** Deterministic value in [0, 1) for a key, so the server and client agree (FNV-1a) */
export function getStableFraction(key: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0) / 2 ** 32
}
