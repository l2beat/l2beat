import {
  type DiffHistoryEntry,
  DiffHistoryParser,
  type DiffHistorySectionKind,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync, statSync } from 'fs'
import path from 'path'
import {
  countDiffChanges,
  isHighSeverityDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'

export type DiscoveryUpdateSectionKind = Extract<
  DiffHistorySectionKind,
  'initial-discovery' | 'watched-changes'
>

export interface DiscoveryUpdateSection {
  kind: DiscoveryUpdateSectionKind
  body: string
}

export interface DiscoveryUpdate {
  date: string
  timestamp: number | null
  description: string
  isHighSeverity: boolean
  changeCount: number
  sections: DiscoveryUpdateSection[]
}

const PUBLIC_SECTION_KINDS = new Set<DiscoveryUpdateSectionKind>([
  'initial-discovery',
  'watched-changes',
])

const PROJECT_ID_RE = /^[a-z0-9-]+$/i
const DEFAULT_LIMIT = 50
const RECENT_UPDATES_WINDOW_SECONDS = 7 * 24 * 60 * 60

const diffHistoryParser = new DiffHistoryParser()

/**
 * Parsing diffHistory.md is expensive and the overview fetcher calls this for
 * every project on each render, so cache the full parse per file mtime.
 */
const parseCache = new Map<
  string,
  { mtimeMs: number; updates: DiscoveryUpdate[] }
>()

export function getDiscoveryUpdates(
  projectId: string,
  limit = DEFAULT_LIMIT,
): DiscoveryUpdate[] {
  if (!PROJECT_ID_RE.test(projectId)) {
    return []
  }

  const diffHistoryPath = getDiffHistoryPath(projectId)
  if (!existsSync(diffHistoryPath)) {
    return []
  }

  const mtimeMs = statSync(diffHistoryPath).mtimeMs
  const cached = parseCache.get(projectId)
  if (cached && cached.mtimeMs === mtimeMs) {
    return cached.updates.slice(0, limit)
  }

  const content = readFileSync(diffHistoryPath, 'utf-8')
  const updates = parseDiscoveryUpdates(content, Number.POSITIVE_INFINITY)
  parseCache.set(projectId, { mtimeMs, updates })

  return updates.slice(0, limit)
}

export function parseDiscoveryUpdates(
  content: string,
  limit = DEFAULT_LIMIT,
): DiscoveryUpdate[] {
  const updates: DiscoveryUpdate[] = []

  for (const entry of diffHistoryParser.parse(content)) {
    const update = toPublicDiscoveryUpdate(entry)
    if (update !== null) {
      updates.push(update)
      if (updates.length >= limit) {
        break
      }
    }
  }

  return updates
}

export function countRecentDiscoveryUpdates(
  updates: DiscoveryUpdate[],
  now: number = UnixTime.now(),
): number {
  return updates.filter(
    (update) =>
      update.timestamp !== null &&
      now - update.timestamp <= RECENT_UPDATES_WINDOW_SECONDS,
  ).length
}

function getDiffHistoryPath(projectId: string): string {
  return path.join(
    process.cwd(),
    '../config/src/projects',
    projectId,
    'diffHistory.md',
  )
}

function toPublicDiscoveryUpdate(
  entry: DiffHistoryEntry,
): DiscoveryUpdate | null {
  const sections: DiscoveryUpdateSection[] = entry.sections.flatMap(
    (section) => {
      if (
        !PUBLIC_SECTION_KINDS.has(section.kind as DiscoveryUpdateSectionKind)
      ) {
        return []
      }
      if (section.body.length === 0) {
        return []
      }
      return [
        {
          kind: section.kind as DiscoveryUpdateSectionKind,
          body: section.body,
        },
      ]
    },
  )

  if (sections.length === 0) {
    return null
  }

  const bodies = sections.map((section) => section.body)

  return {
    date: entry.date,
    timestamp: getTimestamp(entry),
    description: entry.description,
    isHighSeverity: bodies.some((body) => isHighSeverityDiffBody(body)),
    changeCount: bodies.reduce((sum, body) => sum + countDiffChanges(body), 0),
    sections,
  }
}

function getTimestamp(entry: DiffHistoryEntry): number | null {
  if (entry.current?.kind === 'timestamp') {
    return entry.current.value
  }

  const timestamp = Date.parse(entry.date)
  return Number.isFinite(timestamp) ? Math.floor(timestamp / 1000) : null
}
