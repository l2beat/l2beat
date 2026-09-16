import {
  countDiffChanges,
  type DiffHistoryEntry,
  DiffHistoryParser,
  extractDiffBlockSpans,
  getDiscoveryPaths,
  isHighSeverityDiffBody,
} from '@l2beat/discovery'
import { hashJson } from '@l2beat/shared'
import type { ProjectId } from '@l2beat/shared-pure'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import type {
  ProjectDiscoveryUpdate,
  ProjectDiscoveryUpdateSection,
  ProjectDiscoveryUpdateSectionKind,
} from '../types'

const PUBLIC_SECTION_KINDS = new Set<ProjectDiscoveryUpdateSectionKind>([
  'initial-discovery',
  'watched-changes',
])
const CONTRACT_CREATED_RE = /^\+\s+Status: CREATED\s*\n\s+contract\b/m
const CONTRACT_BECAME_VERIFIED_RE =
  /^\s+contract\b[\s\S]*?^\s+unverified:\s*\n-\s+true\s*$/m

const diffHistoryParser = new DiffHistoryParser()

export function loadDiscoveryUpdates(
  projectId: ProjectId,
): ProjectDiscoveryUpdate[] | undefined {
  const diffHistoryPath = join(
    getDiscoveryPaths().discovery,
    projectId,
    'diffHistory.md',
  )
  if (!existsSync(diffHistoryPath)) {
    return undefined
  }
  return parseDiscoveryUpdates(readFileSync(diffHistoryPath, 'utf-8'))
}

export function parseDiscoveryUpdates(
  content: string,
): ProjectDiscoveryUpdate[] {
  const updates: ProjectDiscoveryUpdate[] = []
  for (const entry of diffHistoryParser.parse(content)) {
    const sections = getPublicSections(entry)
    if (sections.length === 0) continue
    updates.push(toDiscoveryUpdate(entry, sections))
  }
  return updates
}

function toDiscoveryUpdate(
  entry: DiffHistoryEntry,
  sections: ProjectDiscoveryUpdateSection[],
): ProjectDiscoveryUpdate {
  const bodies = sections.map((section) => section.body)
  return {
    id: getUpdateId(entry),
    date: entry.date,
    timestamp: entry.timestamp,
    description: entry.description,
    isHighSeverity: bodies.some((body) => isHighSeverityDiffBody(body)),
    changeCount: bodies.reduce((sum, body) => sum + countDiffChanges(body), 0),
    sections,
  }
}

function getUpdateId(entry: DiffHistoryEntry): string {
  const fingerprint = hashJson([
    entry.date,
    entry.discoveryHash,
    entry.current?.kind ?? null,
    entry.current?.value ?? null,
    entry.description,
    entry.sections.flatMap((section) => [section.kind, section.body]),
  ])
  return fingerprint.slice(2, 10)
}

function getPublicSections(
  entry: DiffHistoryEntry,
): ProjectDiscoveryUpdateSection[] {
  return entry.sections.flatMap((section) => {
    if (section.kind === 'config-related-changes') {
      const body = getPublicConfigRelatedChanges(section.body)
      return body.length > 0 ? [{ kind: section.kind, body }] : []
    }
    if (
      !PUBLIC_SECTION_KINDS.has(
        section.kind as ProjectDiscoveryUpdateSectionKind,
      )
    ) {
      return []
    }
    if (section.body.length === 0) {
      return []
    }
    return [
      {
        kind: section.kind as ProjectDiscoveryUpdateSectionKind,
        body: section.body,
      },
    ]
  })
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
