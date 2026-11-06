import { assert, type json } from '@l2beat/shared-pure'
import { isPendingItem, visitObjects } from './watchedValue'

// A pending item is an object with `pending: true`. It is never accepted into
// watched.json, so it stays in the diff against the committed file, and the
// reminder keeps listing it, until the template stops marking it.
export function stripPendingItems(
  values: Record<string, json>,
): Record<string, json> {
  const result: Record<string, json> = {}
  for (const [key, value] of Object.entries(values)) {
    assertWatchValueNotPending(key, value)
    const copy = structuredClone(value)
    visitObjects(copy, (object) => {
      for (const [childKey, child] of Object.entries(object)) {
        if (isPendingItem(child)) {
          delete object[childKey]
        }
      }
    })
    result[key] = copy
  }
  return result
}

export function countPendingItems(values: Record<string, json>): number {
  let count = 0
  for (const [key, value] of Object.entries(values)) {
    assertWatchValueNotPending(key, value)
    visitObjects(value, (object) => {
      for (const child of Object.values(object)) {
        if (isPendingItem(child)) {
          count++
        }
      }
    })
  }
  return count
}

// Only items of keyed objects can be pending. A pending watch value would be
// stripped whole, leaving its key missing from watched.json.
export function assertWatchValueNotPending(key: string, value: json): void {
  assert(!isPendingItem(value), 'Watch value is a pending item', { key })
}
