import { DiffHistoryParser } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

export type PublicDiffHistorySectionKind =
  | 'watched-changes'
  | 'initial-discovery'

export interface PublicDiffHistorySection {
  kind: PublicDiffHistorySectionKind
  body: string
}

export interface PublicDiffHistoryEntry {
  date: string
  description: string
  /** Number of fenced diff blocks under Watched changes only. */
  watchedChangeCount: number
  /** True when watched diffs include explicit HIGH severity or an implementation address change. */
  highSeverity: boolean
  sections: PublicDiffHistorySection[]
}

export interface RecentChangesResponse {
  total: number
  page: number
  pageSize: number
  entries: PublicDiffHistoryEntry[]
}

const PUBLIC_SECTION_KINDS = new Set<PublicDiffHistorySectionKind>([
  'watched-changes',
  'initial-discovery',
])

const DIFF_FENCE_OPEN = '```diff'

function countDiffFences(body: string): number {
  if (!body.includes(DIFF_FENCE_OPEN)) return 0
  const re = /^```diff$/gm
  let n = 0
  for (const _ of body.matchAll(re)) n++
  return n
}

function watchedBodyIndicatesHighSeverity(body: string): boolean {
  if (/\bseverity:\s*HIGH\b/i.test(body)) return true
  // Discovery template: implementation pointer changed (minus then plus lines).
  if (/values\.\$implementation:\s*\r?\n-\s*.+\r?\n\+/m.test(body)) return true
  return false
}

const parser = new DiffHistoryParser()
const cache = new Map<string, PublicDiffHistoryEntry[]>()

export function getDiffHistoryPath(projectId: string): string {
  return resolve(
    process.cwd(),
    '../config/src/projects',
    projectId,
    'diffHistory.md',
  )
}

export function hasRecentChanges(projectId: string): boolean {
  return readPublicEntries(projectId).length > 0
}

export function entryDateToUnixMs(date: string): number {
  const t = Date.parse(date)
  return Number.isFinite(t) ? t : 0
}

export function filterEntriesByMaxAgeDays(
  entries: PublicDiffHistoryEntry[],
  maxAgeDays: number,
  nowMs: number = Date.now(),
): PublicDiffHistoryEntry[] {
  if (maxAgeDays <= 0) return entries
  const cutoff = nowMs - maxAgeDays * 24 * 60 * 60 * 1000
  return entries.filter((e) => entryDateToUnixMs(e.date) >= cutoff)
}

export function countRecentChangesEntriesInLastDays(
  projectId: string,
  days: number,
  nowMs: number = Date.now(),
): number {
  return filterEntriesByMaxAgeDays(
    readPublicEntries(projectId),
    days,
    nowMs,
  ).length
}

function readPublicEntries(projectId: string): PublicDiffHistoryEntry[] {
  const cached = cache.get(projectId)
  if (cached) return cached

  const filePath = getDiffHistoryPath(projectId)
  if (!existsSync(filePath)) {
    cache.set(projectId, [])
    return []
  }

  const content = readFileSync(filePath, 'utf-8')
  const parsed = parser.parse(content)

  const entries: PublicDiffHistoryEntry[] = []
  for (const entry of parsed) {
    const sections: PublicDiffHistorySection[] = []
    let watchedChangeCount = 0
    let highSeverity = false
    for (const section of entry.sections) {
      const kind = section.kind as
        | PublicDiffHistorySectionKind
        | 'source-code-changes'
      if (kind === 'source-code-changes') {
        continue
      }
      if (PUBLIC_SECTION_KINDS.has(kind) && section.body.length > 0) {
        sections.push({
          kind,
          body: section.body,
        })
        if (kind === 'watched-changes') {
          watchedChangeCount += countDiffFences(section.body)
          if (watchedBodyIndicatesHighSeverity(section.body)) {
            highSeverity = true
          }
        }
      }
    }
    const description = entry.description.trim()
    // Skip entries with no public diff sections: summary-only or config-only
    // after stripping does not belong in "Recent changes".
    if (sections.length === 0) {
      continue
    }
    entries.push({
      date: entry.date,
      description,
      watchedChangeCount,
      highSeverity,
      sections,
    })
  }

  cache.set(projectId, entries)
  return entries
}

export function getRecentChanges(input: {
  projectId: string
  page: number
  pageSize: number
  maxAgeDays?: number
}): RecentChangesResponse {
  const page = Math.max(1, Math.floor(input.page))
  const pageSize = Math.max(1, Math.floor(input.pageSize))
  let entries = readPublicEntries(input.projectId)
  const maxAge = input.maxAgeDays
  if (maxAge !== undefined && Number.isFinite(maxAge)) {
    const d = Math.floor(maxAge)
    if (d > 0) {
      entries = filterEntriesByMaxAgeDays(entries, d)
    }
  }
  const start = (page - 1) * pageSize
  return {
    total: entries.length,
    page,
    pageSize,
    entries: entries.slice(start, start + pageSize),
  }
}
