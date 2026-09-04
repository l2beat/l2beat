import {
  createDiffHistoryEntryIdFactory,
  type DiffHistoryEntry,
  DiffHistoryParser,
  type DiffHistorySectionKind,
  getDiffHistoryEntryTimestamp,
} from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { existsSync, readFileSync, statSync } from 'fs'
import path from 'path'
import {
  countDiffChanges,
  extractDiffBlockSpans,
  isHighSeverityDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'

export type DiscoveryUpdateSectionKind = Extract<
  DiffHistorySectionKind,
  'config-related-changes' | 'initial-discovery' | 'watched-changes'
>

export interface DiscoveryUpdateSection {
  kind: DiscoveryUpdateSectionKind
  body: string
}

export interface DiscoveryUpdate {
  id: string
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
const CONTRACT_CREATED_RE = /^\+\s+Status: CREATED\s*\n\s+contract\b/m
const CONTRACT_BECAME_VERIFIED_RE =
  /^\s+contract\b[\s\S]*?^\s+unverified:\s*\n-\s+true\s*$/m

const PROJECT_ID_RE = /^[a-z0-9-]+$/i
const DEFAULT_LIMIT = 50
const RECENT_UPDATES_WINDOW_SECONDS = 7 * 24 * 60 * 60

const diffHistoryParser = new DiffHistoryParser()

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

  // Stable identity shared with changelog.json entries: derived from the
  // mechanically fixed date and chain point (plus a per-file ordinal for the
  // rare collisions), so a later description edit never orphans references
  // (criticalEvents updateId, deep links). Every entry gets an id before any
  // filtering so ordinals agree with buildDiscoveryChangelog.
  const idFor = createDiffHistoryEntryIdFactory()
  for (const entry of diffHistoryParser.parse(content)) {
    const id = idFor(entry.date, entry.current)
    const update = toPublicDiscoveryUpdate(entry, id)
    if (update === null) continue

    updates.push(update)
    if (updates.length >= limit) {
      break
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
  id: string,
): DiscoveryUpdate | null {
  const sections: DiscoveryUpdateSection[] = entry.sections.flatMap(
    (section) => {
      if (section.kind === 'config-related-changes') {
        const body = getPublicConfigRelatedChanges(section.body)
        return body.length > 0 ? [{ kind: section.kind, body }] : []
      }
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
    id,
    date: entry.date,
    timestamp: getTimestamp(entry),
    description: entry.description,
    isHighSeverity: bodies.some((body) => isHighSeverityDiffBody(body)),
    changeCount: bodies.reduce((sum, body) => sum + countDiffChanges(body), 0),
    sections,
  }
}

function getPublicConfigRelatedChanges(body: string): string {
  return extractDiffBlockSpans(body)
    .filter(({ content }) => {
      return (
        CONTRACT_CREATED_RE.test(content) ||
        CONTRACT_BECAME_VERIFIED_RE.test(content)
      )
    })
    .map(({ start, end }) => body.slice(start, end))
    .join('\n\n')
}

function getTimestamp(entry: DiffHistoryEntry): number | null {
  return getDiffHistoryEntryTimestamp(entry.date, entry.current)
}
