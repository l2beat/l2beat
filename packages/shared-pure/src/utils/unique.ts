type Primitive = string | number | boolean | bigint | symbol | null | undefined

export function unique<T extends Primitive>(array: T[]): T[]
export function unique<T, K>(array: T[], keyFn: (item: T) => K): T[]
export function unique<T, K>(array: T[], keyFn?: (item: T) => K): T[] {
  if (!keyFn) {
    return [...new Set(array)]
  }

  const seen = new Map<K, T>()
  for (const item of array) {
    const key = keyFn(item)
    if (!seen.has(key)) {
      seen.set(key, item)
    }
  }
  return Array.from(seen.values())
}
