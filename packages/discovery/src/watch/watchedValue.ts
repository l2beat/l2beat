import { assert, type json } from '@l2beat/shared-pure'

// Template outputs are flat by design; a deeper value is a template bug.
export const MAX_WATCHED_DEPTH = 8

export type JsonObject = { [key: string]: json }

export function isJsonObject(value: json | undefined): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isPendingItem(value: json | undefined): boolean {
  return isJsonObject(value) && Object.hasOwn(value, 'pending')
    ? value.pending === true
    : false
}

// Returns a copy with object keys sorted at every level, so one template
// output always serializes to the same text. Arrays keep their order: sorting
// them is the template's call.
export function sortDeep(value: json): json {
  const result = copyShallow(value)
  const stack: { source: json; target: json; depth: number }[] = [
    { source: value, target: result, depth: 0 },
  ]
  for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
    const { source, target, depth } = item
    assert(depth <= MAX_WATCHED_DEPTH, 'Watched value too deep')
    if (Array.isArray(source)) {
      assert(Array.isArray(target))
      for (const element of source) {
        const copy = copyShallow(element)
        target.push(copy)
        stack.push({ source: element, target: copy, depth: depth + 1 })
      }
    } else if (isJsonObject(source)) {
      assert(isJsonObject(target))
      for (const key of Object.keys(source).sort()) {
        assert(!key.includes('\n'), 'Watched key with a newline', { key })
        const child = source[key]
        assert(child !== undefined, 'Watched value with undefined', { key })
        const copy = copyShallow(child)
        target[key] = copy
        stack.push({ source: child, target: copy, depth: depth + 1 })
      }
    }
  }
  return result
}

function copyShallow(value: json): json {
  if (Array.isArray(value)) {
    return []
  }
  if (isJsonObject(value)) {
    return {}
  }
  assert(value !== undefined, 'Watched value with undefined')
  if (typeof value === 'number') {
    assert(Number.isFinite(value), 'Watched number not finite', { value })
  }
  return value
}

// Visits every object inside `root`, parents before children. The visitor may
// delete keys of the object it is given; deleted children are not visited.
export function visitObjects(
  root: json,
  visit: (object: JsonObject) => void,
): void {
  const stack: { value: json; depth: number }[] = [{ value: root, depth: 0 }]
  for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
    const { value, depth } = item
    assert(depth <= MAX_WATCHED_DEPTH, 'Watched value too deep')
    if (Array.isArray(value)) {
      for (const element of value) {
        assert(!isPendingItem(element), 'Pending item inside an array')
        stack.push({ value: element, depth: depth + 1 })
      }
    } else if (isJsonObject(value)) {
      visit(value)
      for (const child of Object.values(value)) {
        stack.push({ value: child, depth: depth + 1 })
      }
    }
  }
}
