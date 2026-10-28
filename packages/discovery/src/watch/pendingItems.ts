import type { json } from '@l2beat/shared-pure'
import { isPendingItem, visitObjects } from './watchedValue'

// A pending item is an object with `pending: true`. It is never accepted into
// watched.json, so it stays in the diff against the committed file, and the
// reminder keeps listing it, until the template stops marking it.
export function stripPendingItems(
  values: Record<string, json>,
): Record<string, json> {
  const result: Record<string, json> = {}
  for (const [key, value] of Object.entries(values)) {
    if (isPendingItem(value)) {
      continue
    }
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
  for (const value of Object.values(values)) {
    if (isPendingItem(value)) {
      count++
      continue
    }
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
