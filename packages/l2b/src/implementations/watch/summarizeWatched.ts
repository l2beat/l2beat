import { isPendingItem, type WatchDiff } from '@l2beat/discovery'
import type { json } from '@l2beat/shared-pure'

type JsonObject = { [key: string]: json }

// Totals (items, pending) of the keyed objects at the top of each value, then
// one line per watch key that differs from main.
export function summarizeWatched(
  values: Record<string, json>,
  diff: WatchDiff[],
): string[] {
  const lines: string[] = []
  for (const [key, value] of Object.entries(values)) {
    lines.push(...summarizeKeyedObjects(key, value))
  }
  for (const { key, changes } of diff) {
    const added = changes.filter((c) => c.before === undefined).length
    const removed = changes.filter((c) => c.after === undefined).length
    const changed = changes.length - added - removed
    lines.push(
      `${key}: ${added} added, ${removed} removed, ${changed} changed against main`,
    )
  }
  return lines
}

function summarizeKeyedObjects(key: string, value: json): string[] {
  if (!isObject(value)) {
    return []
  }
  const children = Object.entries(value).flatMap(([childKey, child]) =>
    isObject(child) && isKeyedObject(child)
      ? [formatTotals(`${key}.${childKey}`, child)]
      : [],
  )
  if (children.length > 0) {
    return children
  }
  return isKeyedObject(value) ? [formatTotals(key, value)] : []
}

// Items of one type: records like leads, names like incidents, or a set of
// `true` like recorded. A mixed object is a record, not a list.
function isKeyedObject(value: JsonObject): boolean {
  const types = new Set(Object.values(value).map(typeOf))
  return types.size === 1
}

function formatTotals(path: string, value: JsonObject): string {
  const items = Object.values(value)
  const pending = items.filter((item) => isPendingItem(item)).length
  return `${path}: ${items.length} items, ${pending} pending`
}

function typeOf(value: json): string {
  return Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value
}

function isObject(value: json): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
