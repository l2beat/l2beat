import type { SolidityDiff } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type { AuditedFile, Unit } from './AuditCoverage'
import type { AuditedCode } from './AuditedCode'
import type { DeployedAliases } from './deployedSource'
import {
  isCodeLine,
  type Match,
  matchDeclaration,
  newestOccurrence,
} from './matchDeclaration'
import { type Declaration, splitSource } from './splitSource'

export interface CoveredUnit {
  id: string
  first: number
  unit: Unit
  auditedFile?: { object: string; file: AuditedFile }
}

const UNIT_ID_LENGTH = 12

export function coverFlat(
  flat: string,
  aliases: DeployedAliases,
  code: AuditedCode,
  project: string,
): CoveredUnit[] {
  return [...splitSource(flat).declarations].map(([name, declaration]) => {
    const { kind, body } = declaration
    const used = aliasesUsedBy(body, aliases.get(name))
    const deployed = { name, kind, body, aliases: used }
    const match = matchDeclaration(deployed, code, project)
    const id = createHash('sha256').update(body).digest('hex')
    return {
      id: id.slice(0, UNIT_ID_LENGTH),
      first: declaration.lines.first,
      ...toUnit(name, declaration, match, code),
    }
  })
}

function aliasesUsedBy(
  body: string,
  aliases: Map<string, string> | undefined,
): [string, string][] {
  return [...(aliases ?? [])]
    .filter(([, name]) => body.includes(name))
    .sort(([a], [b]) => (a < b ? -1 : 1))
}

function toUnit(
  name: string,
  declaration: Declaration,
  match: Match | undefined,
  code: AuditedCode,
): Pick<CoveredUnit, 'unit' | 'auditedFile'> {
  const { lines } = declaration
  const unit: Unit = {
    name,
    kind: declaration.kind,
    lines: lines.last - lines.first + 1,
    status: 'none',
  }
  if (match === undefined) {
    return { unit }
  }
  const { candidate } = match
  const occurrence = newestOccurrence(candidate, code)
  const audited = code.declarationsByObject
    .get(occurrence.object)
    ?.get(candidate.name)
  assert(audited?.body === candidate.body, `${occurrence.object} lost a unit`)
  unit.status = match.identical ? 'identical' : 'differs'
  unit.audited = {
    object: occurrence.object,
    lines: [audited.lines.first, audited.lines.last],
  }
  if (candidate.name !== name) {
    unit.audited.name = candidate.name
  }
  unit.reports = reportsOf(candidate.objects, code)
  const findings = findingsOf(candidate.objects, code)
  if (findings !== undefined) {
    unit.findings = findings
  }
  if (!match.identical) {
    const changes = changesOf(match.diff, unit.lines)
    Object.assign(unit, changes)
    unit.covered = unit.lines - addedCodeLines(declaration.body, changes.added)
  }
  const { repository, commit, path } = occurrence
  return {
    unit,
    auditedFile: {
      object: occurrence.object,
      file: { repository, commit, path },
    },
  }
}

function addedCodeLines(
  body: string,
  added: [number, number][] | undefined,
): number {
  const lines = body.split('\n')
  let count = 0
  for (const [first, last] of added ?? []) {
    for (let line = first; line <= last; line++) {
      if (isCodeLine(lines[line] as string)) {
        count++
      }
    }
  }
  return count
}

function reportsOf(objects: string[], code: AuditedCode): string[] {
  const reports = new Set<string>()
  for (const object of objects) {
    for (const occurrence of code.occurrences.get(object) ?? []) {
      for (const report of Object.keys(occurrence.findings)) {
        reports.add(report)
      }
    }
  }
  return [...reports].sort()
}

// A report locates findings in files, not in units: a finding the report saw
// fixed in a copy of the same unit was fixed elsewhere in the file.
function findingsOf(
  objects: string[],
  code: AuditedCode,
): Record<string, string[]> | undefined {
  const open = new Map<string, string[]>()
  for (const object of objects) {
    for (const occurrence of code.occurrences.get(object) ?? []) {
      for (const [report, ids] of Object.entries(occurrence.findings)) {
        const previous = open.get(report)
        open.set(
          report,
          previous === undefined
            ? ids
            : previous.filter((id) => ids.includes(id)),
        )
      }
    }
  }
  const entries = [...open]
    .filter(([, ids]) => ids.length > 0)
    .sort(([a], [b]) => (a < b ? -1 : 1))
  return entries.length === 0 ? undefined : Object.fromEntries(entries)
}

// The diff renders every deployed line in order, unchanged or added, with
// removed audited lines placed among them.
function changesOf(
  diff: SolidityDiff,
  deployedLines: number,
): Pick<Unit, 'added' | 'removed'> {
  const added: [number, number][] = []
  const removed: [number, number, number][] = []
  let deployed = 0
  for (const line of diff.lines) {
    if (line.type === 'removed') {
      const previous = removed[removed.length - 1]
      if (previous?.[0] === deployed && previous[2] + 1 === line.line) {
        previous[2] = line.line
      } else {
        removed.push([deployed, line.line, line.line])
      }
      continue
    }
    assert(line.line === deployed, 'Deployed lines render in order')
    deployed++
    if (line.type === 'added') {
      const previous = added[added.length - 1]
      if (previous?.[1] === line.line - 1) {
        previous[1] = line.line
      } else {
        added.push([line.line, line.line])
      }
    }
  }
  assert(deployed === deployedLines, 'Every deployed line is rendered')
  return { added, removed }
}
