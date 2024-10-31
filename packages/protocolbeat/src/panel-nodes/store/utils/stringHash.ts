export function stringHash(str: string): number {
  let hash = 0x811c9dc5
  const fnvPrime = 0x01000193

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = (hash * fnvPrime) >>> 0
  }

  return hash
}
