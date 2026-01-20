export function toSafeJSON(parameters: unknown, pretty = false): string {
  return JSON.stringify(
    normalize(parameters),
    (_k, v: unknown) => {
      if (typeof v === 'bigint') {
        return { $type: 'bigint', value: v.toString() }
      }
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        const sorted: Record<string, unknown> = {}
        for (const key of Object.keys(v).sort()) {
          sorted[key] = (v as Record<string, unknown>)[key]
        }
        return sorted
      }
      return v
    },
    pretty ? 2 : undefined,
  )
}

export function fromSafeJSON(data: string): Record<string, unknown> {
  return JSON.parse(data, (_, value: unknown) => {
    if (
      typeof value === 'object' &&
      value !== null &&
      '$type' in value &&
      value.$type === 'bigint'
    ) {
      return BigInt((value as { $type: 'bigint'; value: string }).value)
    }
    return value
  })
}

export function sortKeys(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(sortKeys)
  }
  const sorted: Record<string, unknown> = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = sortKeys((obj as Record<string, unknown>)[key])
  }
  return sorted
}

/**
 * Normalizes data for snapshot comparison by:
 * 1. Removing undefined fields
 * 2. Normalizing random fields like eventId to stable values
 */
export function normalize(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return null
  }

  if (typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(normalize)
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined values
    if (value === undefined) {
      continue
    }

    // Normalize eventId to a stable value
    if (key === 'eventId' && typeof value === 'string') {
      result[key] = 'NORMALIZED_EVENT_ID'
      continue
    }

    result[key] = normalize(value)
  }

  return result
}
