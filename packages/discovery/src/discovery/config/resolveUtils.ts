export type WithDefaults<L, K extends keyof L> = Omit<L, K> & {
  [P in K]-?: NonNullable<L[P]>
}

export function resolveByShape<L extends object, K extends keyof L = never>(
  shape: object,
  layer: L,
  defaults: { [P in K]-?: NonNullable<L[P]> },
): WithDefaults<L, K> {
  const source = layer as Record<string, unknown>
  const fallback = defaults as Record<string, unknown>
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(shape)) {
    const value = source[key] ?? fallback[key]
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result as WithDefaults<L, K>
}

export function pickByShape<L extends object>(shape: object, layer: L): L {
  return resolveByShape(shape, layer, {})
}

export function mapRecord<V, R>(
  record: Record<string, V>,
  map: (value: V) => R,
): Record<string, R> {
  const result: Record<string, R> = {}
  for (const [key, value] of Object.entries(record)) {
    result[key] = map(value)
  }
  return result
}
