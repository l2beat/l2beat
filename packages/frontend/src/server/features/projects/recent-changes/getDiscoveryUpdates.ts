import {
  type DiffHistoryEntry,
  DiffHistoryParser,
  type DiffHistorySectionKind,
} from '@l2beat/shared'
import { readFileSync } from 'fs'
import {
  countDiffChanges,
  isHighSeverityDiffBody,
} from '~/utils/diffHistory/diffHistoryMarkdown'
import { getDiffHistoryPath } from './diffHistory/getDiffHistoryPath'

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

const diffHistoryParser = new DiffHistoryParser()

export function getDiscoveryUpdates(
  projectId: string,
  limit = DEFAULT_LIMIT,
): DiscoveryUpdate[] {
  if (!PROJECT_ID_RE.test(projectId)) {
    return []
  }

  const content = readDiffHistoryContent(projectId)
  if (content === undefined) {
    return []
  }

  return parseDiscoveryUpdates(content, limit)
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

function readDiffHistoryContent(projectId: string): string | undefined {
  const diffHistoryPath = getDiffHistoryPath(projectId)
  if (diffHistoryPath === undefined) {
    return undefined
  }

  return readFileSync(diffHistoryPath, 'utf-8')
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
