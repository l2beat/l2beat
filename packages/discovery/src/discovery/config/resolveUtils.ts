export type WithDefaults<L, K extends keyof L> = Omit<L, K> & {
  [P in K]-?: NonNullable<L[P]>
}

export function resolveByShape<L extends object, K extends keyof L = never>(
  shape: Record<keyof L, unknown>,
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

export function pickByShape<L extends object>(
  shape: Record<keyof L, unknown>,
  layer: L,
): L {
  return resolveByShape(shape, layer, {})
}

export function resolveContract<
  L extends { fields?: Record<string, object> },
  K extends keyof L,
>(
  shape: Record<keyof L, unknown>,
  fieldShape: Record<keyof NonNullable<L['fields']>[string], unknown>,
  layer: L,
  defaults: { [P in K | 'fields']-?: NonNullable<L[P]> },
): WithDefaults<L, K | 'fields'> {
  const contract = resolveByShape(shape, layer, defaults)
  const fields: Record<string, object> = contract.fields
  return {
    ...contract,
    fields: mapRecord(fields, (field) => pickByShape(fieldShape, field)),
  }
}

export function resolveConfig<
  L extends { overrides?: Record<string, object> },
  K extends keyof L,
  R,
>(
  shape: Record<keyof L, unknown>,
  layer: L,
  defaults: { [P in K]-?: NonNullable<L[P]> },
  resolveOverride: (override: NonNullable<L['overrides']>[string]) => R,
): Omit<WithDefaults<L, K>, 'overrides'> & { overrides?: Record<string, R> } {
  const { overrides, ...rest } = layer
  const config: Omit<WithDefaults<L, K>, 'overrides'> = resolveByShape(
    shape,
    rest as L,
    defaults,
  )
  return {
    ...config,
    ...(overrides && {
      overrides: mapRecord(
        overrides as Record<string, NonNullable<L['overrides']>[string]>,
        resolveOverride,
      ),
    }),
  }
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
