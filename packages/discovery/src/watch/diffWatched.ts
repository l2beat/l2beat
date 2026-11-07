import { assert, type json } from '@l2beat/shared-pure'
import { isJsonObject, MAX_WATCHED_DEPTH } from './watchedValue'

export interface WatchChange {
  // Item ids of keyed objects are path segments.
  path: string[]
  before?: json
  after?: json
}

export interface WatchDiff {
  key: string
  changes: WatchChange[]
}

export function diffWatched(
  previous: Record<string, json>,
  current: Record<string, json>,
): WatchDiff[] {
  const diffs: WatchDiff[] = []
  for (const key of unionOfKeys(previous, current)) {
    const changes = diffValue(ownValue(previous, key), ownValue(current, key))
    if (changes.length > 0) {
      diffs.push({ key, changes })
    }
  }
  return diffs
}

// Objects are compared key by key, so an added or removed item of a keyed
// object is one change. Anything else is compared as a whole.
function diffValue(
  before: json | undefined,
  after: json | undefined,
): WatchChange[] {
  const changes: WatchChange[] = []
  const stack: { path: string[]; before?: json; after?: json }[] = [
    { path: [], before, after },
  ]
  for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
    assert(item.path.length <= MAX_WATCHED_DEPTH, 'Watched value too deep')
    if (isJsonObject(item.before) && isJsonObject(item.after)) {
      // Reversed so that popping visits keys in sorted order.
      const keys = unionOfKeys(item.before, item.after).reverse()
      for (const key of keys) {
        stack.push({
          path: [...item.path, key],
          before: ownValue(item.before, key),
          after: ownValue(item.after, key),
        })
      }
      continue
    }
    const change = toChange(item.path, item.before, item.after)
    if (change !== undefined) {
      changes.push(change)
    }
  }
  return changes
}

function toChange(
  path: string[],
  before: json | undefined,
  after: json | undefined,
): WatchChange | undefined {
  if (before === undefined) {
    assert(after !== undefined, 'Diffed a key absent on both sides')
    return { path, after }
  }
  if (after === undefined) {
    return { path, before }
  }
  if (JSON.stringify(before) === JSON.stringify(after)) {
    return undefined
  }
  return { path, before, after }
}

function unionOfKeys(
  a: Record<string, json>,
  b: Record<string, json>,
): string[] {
  return [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()
}

// A key present on one side only must read as absent on the other, even when
// it names an Object.prototype member such as `constructor`.
function ownValue(object: Record<string, json>, key: string): json | undefined {
  return Object.hasOwn(object, key) ? object[key] : undefined
}
