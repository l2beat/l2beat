import { assert, type json } from '@l2beat/shared-pure'
import type { WatchChange, WatchDiff } from './diffWatched'
import { isJsonObject } from './watchedValue'

const KEY_INDENT = '    '
const CHANGE_INDENT = '     '
const HASH_SHORTEN_ABOVE = 20
const INLINE_LENGTH_MAX = 400
const FENCE_START = '```diff'
const FENCE_END = '\n```'
const OVERFLOW_SUFFIX = '\n... (message too long)\n```'

export function watchDiffToMarkdown(
  diff: WatchDiff[],
  maxLength: number = Number.MAX_SAFE_INTEGER,
): string {
  const lines = [FENCE_START]
  for (const { key, changes } of diff) {
    lines.push(`${KEY_INDENT}${key} {`)
    for (const change of changes) {
      lines.push(...changeToLines(change))
    }
    lines.push(`${KEY_INDENT}}`)
  }
  const body = lines.join('\n')
  const full = `${body}${FENCE_END}`
  if (full.length <= maxLength) {
    return full
  }
  const limit = maxLength - OVERFLOW_SUFFIX.length
  assert(
    limit >= FENCE_START.length,
    'maxLength must fit watch diff overflow message',
    { maxLength },
  )
  return `${body.slice(0, limit)}${OVERFLOW_SUFFIX}`
}

function changeToLines(change: WatchChange): string[] {
  const path = change.path.map(shortenHashes)
  // A keyed set (values all `true`) reads as a list of its keys.
  const isSetItem = change.before === undefined || change.after === undefined
  const lines: string[] = []
  if (change.before !== undefined) {
    for (const leaf of toLeaves(path, change.before, isSetItem)) {
      lines.push(`-${CHANGE_INDENT}${leaf}`)
    }
  }
  if (change.after !== undefined) {
    for (const leaf of toLeaves(path, change.after, isSetItem)) {
      lines.push(`+${CHANGE_INDENT}${leaf}`)
    }
  }
  return lines
}

// A large added or removed object, like the first value of a watch, is
// listed one level down with long children collapsed: the entry is for
// humans and git, and the full value stays in watched.json.
function toLeaves(path: string[], value: json, isSetItem: boolean): string[] {
  if (!isSetItem || !isJsonObject(value) || isShort(value)) {
    return [formatLeaf(path, value, isSetItem)]
  }
  return Object.entries(value).map(([key, child]) =>
    formatLeaf([...path, shortenHashes(key)], child, isSetItem),
  )
}

function formatLeaf(path: string[], value: json, isSetItem: boolean): string {
  const joined = path.join('.')
  if (isSetItem && value === true) {
    return joined
  }
  const text = isShort(value) ? JSON.stringify(value) : collapse(value)
  return joined === '' ? text : `${joined}: ${text}`
}

function isShort(value: json): boolean {
  return JSON.stringify(value).length <= INLINE_LENGTH_MAX
}

function collapse(value: json): string {
  if (Array.isArray(value)) {
    return `[…${value.length} items]`
  }
  if (isJsonObject(value)) {
    return `{…${Object.keys(value).length} keys}`
  }
  return JSON.stringify(value)
}

// The entry is for humans and git; the full key stays in watched.json.
function shortenHashes(segment: string): string {
  return segment
    .split(':')
    .map((part) =>
      part.startsWith('0x') && part.length > HASH_SHORTEN_ABOVE
        ? `${part.slice(0, 6)}…${part.slice(-4)}`
        : part,
    )
    .join(':')
}
