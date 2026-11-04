import { format } from '@l2beat/discovery'
import { parseReportDate } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { type AuditIndex, type AuditIndexSnapshot, covers } from './AuditIndex'
import type { AuditObjects } from './AuditObjects'
import {
  type Declaration,
  type DeclarationKind,
  type SplitSource,
  splitSource,
} from './splitSource'

export interface AuditedCode {
  declarations: AuditedDeclaration[]
  declarationsByObject: Map<string, Map<string, Declaration>>
  occurrences: Map<string, Occurrence[]>
  byName: Map<string, number[]>
  lines: LineIndex
  libraries: Set<string>
  unparsed: string[]
}

export interface AuditedDeclaration {
  name: string
  kind: DeclarationKind
  body: string
  aliases: [string, string][]
  objects: string[]
}

export interface Occurrence {
  repository: string
  commit: string
  timestamp: number
  path: string
  findings: Record<string, string[]>
  directoryScoped: string[]
  collections: string[]
}

interface LineIndex {
  postings: Map<string, number[]>
  weights: number[]
  count: number
}

const LINE_LENGTH_MIN = 4
const LINE_FREQUENCY_MAX = 500
const RENAMED_CANDIDATES_MAX = 5

export function buildAuditedCode(
  index: AuditIndex,
  objects: AuditObjects,
  onProgress: (split: number, count: number) => void,
): AuditedCode {
  const { declarations, declarationsByObject, unparsed } = collectDeclarations(
    objects,
    onProgress,
  )
  return {
    declarations,
    declarationsByObject,
    occurrences: collectOccurrences(index),
    byName: groupByName(declarations),
    lines: buildLineIndex(declarations),
    libraries: new Set(
      Object.entries(index.collections)
        .filter(([, collection]) => collection.kind === 'library')
        .map(([id]) => id),
    ),
    unparsed,
  }
}

export function sameNameCandidates(
  code: AuditedCode,
  name: string,
): AuditedDeclaration[] {
  return (code.byName.get(name) ?? []).map(
    (i) => code.declarations[i] as AuditedDeclaration,
  )
}

export function renamedCandidates(
  code: AuditedCode,
  name: string,
  body: string,
  project: string,
): AuditedDeclaration[] {
  const query = linesOf(body)
  const queryWeight = totalWeight(code.lines, query)
  const shared = new Map<number, number>()
  for (const line of query) {
    const postings = code.lines.postings.get(line)
    if (postings === undefined || postings.length > LINE_FREQUENCY_MAX) {
      continue
    }
    const weight = weightOf(code.lines, line)
    for (const i of postings) {
      shared.set(i, (shared.get(i) ?? 0) + weight)
    }
  }
  return [...shared]
    .filter(([i]) => {
      const declaration = code.declarations[i] as AuditedDeclaration
      if (declaration.name === name) {
        return false
      }
      return isAuditedFor(declaration, code, project)
    })
    .map(([i, sharedWeight]) => {
      const weight = code.lines.weights[i] as number
      return { i, score: sharedWeight / (queryWeight + weight - sharedWeight) }
    })
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, RENAMED_CANDIDATES_MAX)
    .map(({ i }) => code.declarations[i] as AuditedDeclaration)
}

function isAuditedFor(
  declaration: AuditedDeclaration,
  code: AuditedCode,
  project: string,
): boolean {
  return declaration.objects.some((object) =>
    (code.occurrences.get(object) ?? []).some((occurrence) =>
      occurrence.collections.some(
        (collection) =>
          collection === project || code.libraries.has(collection),
      ),
    ),
  )
}

function collectDeclarations(
  objects: AuditObjects,
  onProgress: (split: number, count: number) => void,
) {
  const declarations: AuditedDeclaration[] = []
  const declarationsByObject = new Map<string, Map<string, Declaration>>()
  const byKey = new Map<string, AuditedDeclaration>()
  const unparsed: string[] = []
  const sorted = [...objects].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  for (const [i, [object, source]] of sorted.entries()) {
    onProgress(i, sorted.length)
    const split = trySplitSource(source)
    if (split === undefined) {
      unparsed.push(object)
      continue
    }
    declarationsByObject.set(object, split.declarations)
    for (const [name, { kind, body }] of split.declarations) {
      const aliases = aliasesUsedBy(body, split.aliases)
      const key = JSON.stringify([body, aliases])
      const existing = byKey.get(key)
      if (existing !== undefined) {
        existing.objects.push(object)
        continue
      }
      const declaration = { name, kind, body, aliases, objects: [object] }
      byKey.set(key, declaration)
      declarations.push(declaration)
    }
  }
  return { declarations, declarationsByObject, unparsed }
}

function trySplitSource(source: string): SplitSource | undefined {
  try {
    return splitSource(source)
  } catch {
    return undefined
  }
}

function aliasesUsedBy(
  body: string,
  aliases: Map<string, string>,
): [string, string][] {
  return [...aliases]
    .filter(([alias]) => body.includes(alias))
    .sort(([a], [b]) => (a < b ? -1 : 1))
}

function collectOccurrences(index: AuditIndex): Map<string, Occurrence[]> {
  const occurrences = new Map<string, Occurrence[]>()
  for (const [repository, byCommit] of Object.entries(index.repositories)) {
    for (const [commit, snapshot] of Object.entries(byCommit)) {
      for (const [path, object] of Object.entries(snapshot.files)) {
        const { findings, directoryScoped } = findingsCovering(
          snapshot.audits,
          path,
        )
        const list = occurrences.get(object) ?? []
        list.push({
          repository,
          commit,
          timestamp: snapshot.timestamp,
          path,
          findings,
          directoryScoped,
          collections: collectionsOf(Object.keys(findings), index),
        })
        occurrences.set(object, list)
      }
    }
  }
  return occurrences
}

function findingsCovering(
  audits: AuditIndexSnapshot['audits'],
  path: string,
): Pick<Occurrence, 'findings' | 'directoryScoped'> {
  const findings: Record<string, string[]> = {}
  const directoryScoped: string[] = []
  for (const [report, paths] of Object.entries(audits)) {
    if (Object.keys(paths).some((p) => covers(p, path))) {
      findings[report] = paths[path] ?? []
      if (paths[path] === undefined) {
        directoryScoped.push(report)
      }
    }
  }
  assert(Object.keys(findings).length > 0, `No audit covers ${path}`)
  return { findings, directoryScoped }
}

function collectionsOf(reports: string[], index: AuditIndex): string[] {
  const collections = new Set<string>()
  for (const report of reports) {
    const metadata = index.reports[report]
    assert(metadata !== undefined, `Unknown report ${report}`)
    for (const collection of metadata.collections) {
      assert(index.collections[collection], `Unknown collection ${collection}`)
      collections.add(collection)
    }
  }
  return [...collections].sort()
}

function groupByName(declarations: AuditedDeclaration[]) {
  const byName = new Map<string, number[]>()
  declarations.forEach((declaration, i) => {
    const list = byName.get(declaration.name) ?? []
    list.push(i)
    byName.set(declaration.name, list)
  })
  return byName
}

function buildLineIndex(declarations: AuditedDeclaration[]): LineIndex {
  const postings = new Map<string, number[]>()
  const lines = declarations.map((declaration) => linesOf(declaration.body))
  lines.forEach((declarationLines, i) => {
    for (const line of declarationLines) {
      const list = postings.get(line) ?? []
      list.push(i)
      postings.set(line, list)
    }
  })
  const index: LineIndex = { postings, weights: [], count: declarations.length }
  index.weights = lines.map((declarationLines) =>
    totalWeight(index, declarationLines),
  )
  return index
}

function linesOf(body: string): Set<string> {
  const result = new Set<string>()
  for (const line of normalized(body).split('\n')) {
    const trimmed = line.trim()
    if (trimmed.length >= LINE_LENGTH_MIN) {
      result.add(trimmed)
    }
  }
  return result
}

function normalized(body: string): string {
  try {
    return format(body)
  } catch {
    return body
  }
}

function totalWeight(index: LineIndex, lines: Set<string>): number {
  let total = 0
  for (const line of lines) {
    const frequency = index.postings.get(line)?.length ?? 1
    if (frequency <= LINE_FREQUENCY_MAX) {
      total += weightOf(index, line)
    }
  }
  return total
}

function weightOf(index: LineIndex, line: string): number {
  const frequency = index.postings.get(line)?.length ?? 1
  return Math.log(index.count / frequency) + 1
}

/** Report ids to their publication dates; undated reports are absent. */
export function reportDates(index: AuditIndex): Map<string, number> {
  const dates = new Map<string, number>()
  for (const [id, report] of Object.entries(index.reports)) {
    const date = parseReportDate(report.date, id)
    if (date !== undefined) dates.set(id, date)
  }
  return dates
}

/**
 * When each audited object was first covered by a dated report. Objects
 * covered by undated reports only are absent.
 */
export function firstCountedAt(
  code: AuditedCode,
  dates: Map<string, number>,
): Map<string, number> {
  const first = new Map<string, number>()
  for (const [object, occurrences] of code.occurrences) {
    for (const occurrence of occurrences) {
      for (const report of Object.keys(occurrence.findings)) {
        const date = dates.get(report)
        if (date === undefined) continue
        const known = first.get(object)
        if (known === undefined || date < known) first.set(object, date)
      }
    }
  }
  return first
}

/**
 * The audited code as known at `cutoff`: only the reports dated at or before
 * it count, so an occurrence keeps those reports' findings and is dropped
 * without any, and a declaration stays only where some object of it is still
 * audited. The split declarations are shared with the full index.
 */
export function auditedCodeAt(
  code: AuditedCode,
  index: AuditIndex,
  dates: Map<string, number>,
  cutoff: number,
): AuditedCode {
  const counted = (report: string) => {
    const date = dates.get(report)
    return date !== undefined && date <= cutoff
  }
  const occurrences = new Map<string, Occurrence[]>()
  for (const [object, list] of code.occurrences) {
    const kept = list.flatMap((occurrence): Occurrence[] => {
      const findings = Object.fromEntries(
        Object.entries(occurrence.findings).filter(([report]) =>
          counted(report),
        ),
      )
      const reports = Object.keys(findings)
      if (reports.length === 0) return []
      return [
        {
          ...occurrence,
          findings,
          directoryScoped: occurrence.directoryScoped.filter(counted),
          collections: collectionsOf(reports, index),
        },
      ]
    })
    if (kept.length > 0) occurrences.set(object, kept)
  }
  const declarations = code.declarations.flatMap(
    (declaration): AuditedDeclaration[] => {
      const objects = declaration.objects.filter((o) => occurrences.has(o))
      return objects.length === 0 ? [] : [{ ...declaration, objects }]
    },
  )
  return {
    declarations,
    declarationsByObject: code.declarationsByObject,
    occurrences,
    byName: groupByName(declarations),
    lines: buildLineIndex(declarations),
    libraries: code.libraries,
    unparsed: code.unparsed,
  }
}
