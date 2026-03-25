import { type Difference, diff } from '@l2beat/discovery'
import { withoutUndefinedKeys } from '@l2beat/shared-pure'

type InteropConfigDiffMuteCallback = (entry: Difference) => boolean

export type InteropConfigDiffFilters = Record<
  string,
  InteropConfigDiffMuteCallback[]
>

export const INTEROP_CONFIG_DIFF_FILTERS = {
  polygon: [
    (diff) => diff.path.length === 1 && diff.path[0] === 'lastSyncedBlock',
  ],
} satisfies InteropConfigDiffFilters

export interface InteropConfigDiff {
  key: string
  previous: unknown
  current: unknown
  entries: Difference[]
}

export function diffInteropConfig(
  key: string,
  previous: unknown,
  current: unknown,
): InteropConfigDiff {
  return {
    key,
    previous,
    current,
    entries: diffInteropConfigValues(previous, current),
  }
}

export function diffInteropConfigValues(
  previous: unknown,
  current: unknown,
): Difference[] {
  return diff(normalizeForDiff(previous), normalizeForDiff(current))
}

export function removeMutedInteropConfigDiffEntries(
  interopDiff: InteropConfigDiff,
  filters: InteropConfigDiffFilters = INTEROP_CONFIG_DIFF_FILTERS,
): InteropConfigDiff {
  const filtersForPlugin = filters[interopDiff.key] ?? []

  if (filtersForPlugin.length === 0) {
    return interopDiff
  }

  return {
    ...interopDiff,
    entries: interopDiff.entries.filter(
      (entry) => !filtersForPlugin.some((isFiltered) => isFiltered(entry)),
    ),
  }
}

export function formatDiffPath(path: (string | number)[]): string {
  if (path.length === 0) {
    return '$'
  }
  let result = '$'
  for (const segment of path) {
    if (typeof segment === 'number') {
      result += `[${segment}]`
      continue
    }
    if (/^[$A-Z_a-z][$\w]*$/.test(segment)) {
      result += `.${segment}`
      continue
    }
    result += `[${JSON.stringify(segment)}]`
  }
  return result
}

export function interopConfigDiffToMarkdown(
  interopDiff: InteropConfigDiff,
  maxEntries = Number.MAX_SAFE_INTEGER,
): string {
  const lines = ['```diff']

  const entries = interopDiff.entries.slice(0, maxEntries)
  for (const entry of entries) {
    const path = formatDiffPath(entry.path)

    if (entry.kind === 'create') {
      lines.push(`+ ${path}: ${toOneLine(entry.rhs)}`)
      continue
    }

    if (entry.kind === 'remove') {
      lines.push(`- ${path}: ${toOneLine(entry.lhs)}`)
      continue
    }

    lines.push(`~ ${path}`)
    lines.push(`-   ${toOneLine(entry.lhs)}`)
    lines.push(`+   ${toOneLine(entry.rhs)}`)
  }

  const omittedCount = interopDiff.entries.length - entries.length
  if (omittedCount > 0) {
    lines.push(`...and ${omittedCount} more`)
  }

  lines.push('```')
  return lines.join('\n')
}

function toOneLine(value: unknown): string {
  if (typeof value === 'string') {
    return JSON.stringify(value)
  }
  const serialized = JSON.stringify(value)
  return serialized ?? String(value)
}

function normalizeForDiff(value: unknown): unknown {
  if (value === undefined || value === null) {
    return value
  }
  if (typeof value !== 'object') {
    return value
  }
  return withoutUndefinedKeys(value)
}
