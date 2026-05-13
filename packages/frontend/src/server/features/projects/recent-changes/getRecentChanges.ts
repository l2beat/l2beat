import { DiffHistoryParser } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

export type PublicDiffHistorySectionKind =
  | 'watched-changes'
  | 'initial-discovery'
  | 'source-code-changes'

export interface PublicDiffHistorySection {
  kind: PublicDiffHistorySectionKind
  body: string
}

export interface PublicDiffHistoryEntry {
  date: string
  description: string
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
  'source-code-changes',
])

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
    for (const section of entry.sections) {
      if (
        PUBLIC_SECTION_KINDS.has(
          section.kind as PublicDiffHistorySectionKind,
        ) &&
        section.body.length > 0
      ) {
        sections.push({
          kind: section.kind as PublicDiffHistorySectionKind,
          body: section.body,
        })
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
}): RecentChangesResponse {
  const page = Math.max(1, Math.floor(input.page))
  const pageSize = Math.max(1, Math.floor(input.pageSize))
  const entries = readPublicEntries(input.projectId)
  const start = (page - 1) * pageSize
  return {
    total: entries.length,
    page,
    pageSize,
    entries: entries.slice(start, start + pageSize),
  }
}
