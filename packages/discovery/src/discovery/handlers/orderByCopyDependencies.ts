import type { StructureContract } from '../config/StructureConfig'

export function orderByCopyDependencies(
  fields: StructureContract['fields'],
): string[][] {
  const known = new Set<string>()
  const batches = []
  const remaining = new Set<string>()
  for (const fieldKey in fields) {
    if (fields[fieldKey]?.copy !== undefined) {
      remaining.add(fieldKey)
    } else {
      known.add(fieldKey)
    }
  }

  while (remaining.size > 0) {
    const batch: string[] = []
    for (const fieldKey of remaining) {
      const copy = fields[fieldKey]?.copy
      if (copy !== undefined && known.has(copy)) {
        batch.push(fieldKey)
      }
    }
    if (batch.length === 0) {
      throw new Error('Impossible to resolve dependencies')
    }
    for (const fieldName of batch) {
      known.add(fieldName)
      remaining.delete(fieldName)
    }
    batches.push(batch)
  }

  return batches
}
