import {
  ALL_RULES,
  diffSolidity,
  type Rule,
  type SolidityDiff,
} from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import {
  type AuditedCode,
  type AuditedDeclaration,
  type Occurrence,
  renamedCandidates,
  sameNameCandidates,
} from './AuditedCode'
import {
  canonicalByteType,
  hexLiteralsWithoutUnderscores,
  renameDeclaration,
  setContractKind,
} from './matchingRules'
import type { DeclarationKind } from './splitSource'

export interface DeployedDeclaration {
  name: string
  kind: DeclarationKind
  body: string
  aliases: [string, string][]
}

export interface Match {
  candidate: AuditedDeclaration
  diff: SolidityDiff
  identical: boolean
}

const SAME_NAME_SIMILARITY_MIN = 0.5
const RENAMED_SIMILARITY_MIN = 0.65
const RENAMED_LINES_MIN = 10

export function matchDeclaration(
  deployed: DeployedDeclaration,
  code: AuditedCode,
  project: string,
): Match | undefined {
  const sameName = closest(
    deployed,
    sameNameCandidates(code, deployed.name),
    code,
    (diff, candidate) => allLinesSimilarity(diff, candidate, deployed),
    SAME_NAME_SIMILARITY_MIN,
  )
  if (sameName !== undefined || lineCount(deployed.body) < RENAMED_LINES_MIN) {
    return sameName
  }
  return closest(
    deployed,
    renamedCandidates(code, deployed.name, deployed.body, project),
    code,
    (diff, candidate) => codeLinesSimilarity(diff, candidate, deployed),
    RENAMED_SIMILARITY_MIN,
  )
}

export function newestOccurrence(
  candidate: AuditedDeclaration,
  code: AuditedCode,
): Occurrence & { object: string } {
  let newest: (Occurrence & { object: string }) | undefined
  for (const object of candidate.objects) {
    for (const occurrence of code.occurrences.get(object) ?? []) {
      if (newest === undefined || occurrence.timestamp > newest.timestamp) {
        newest = { ...occurrence, object }
      }
    }
  }
  assert(newest !== undefined, 'Every object occurs in a snapshot')
  return newest
}

function closest(
  deployed: DeployedDeclaration,
  candidates: AuditedDeclaration[],
  code: AuditedCode,
  similarity: (diff: SolidityDiff, candidate: AuditedDeclaration) => number,
  similarityMin: number,
): Match | undefined {
  let best: (Match & { changedCode: number; newest: number }) | undefined
  for (const candidate of candidates) {
    const diff = diffSolidity(
      candidate.body,
      deployed.body,
      rulesFor(candidate, deployed),
    )
    const identical = diff.differences.length === 0
    if (!identical && similarity(diff, candidate) < similarityMin) {
      continue
    }
    const changedCode = identical ? 0 : changedCodeLines(diff)
    const newest = newestOccurrence(candidate, code).timestamp
    if (
      best === undefined ||
      changedCode < best.changedCode ||
      (changedCode === best.changedCode && newest > best.newest)
    ) {
      best = { candidate, diff, identical, changedCode, newest }
    }
  }
  return best
}

function rulesFor(
  candidate: AuditedDeclaration,
  deployed: DeployedDeclaration,
): Rule[] {
  const rules = [...ALL_RULES, canonicalByteType, hexLiteralsWithoutUnderscores]
  for (const [alias, name] of candidate.aliases) {
    rules.push(renameDeclaration(alias, name))
  }
  for (const [alias, name] of deployed.aliases) {
    rules.push(renameDeclaration(name, alias))
  }
  if (candidate.name !== deployed.name) {
    rules.push(renameDeclaration(candidate.name, deployed.name))
  }
  if (
    candidate.kind !== deployed.kind &&
    isContractOrAbstract(candidate.kind) &&
    isContractOrAbstract(deployed.kind)
  ) {
    rules.push(setContractKind(deployed.name, deployed.kind))
  }
  return rules
}

function isContractOrAbstract(kind: DeclarationKind): boolean {
  return kind === 'contract' || kind === 'abstract'
}

function allLinesSimilarity(
  diff: SolidityDiff,
  candidate: AuditedDeclaration,
  deployed: DeployedDeclaration,
): number {
  const total = lineCount(candidate.body) + lineCount(deployed.body)
  return 1 - (diff.added + diff.removed) / total
}

function codeLinesSimilarity(
  diff: SolidityDiff,
  candidate: AuditedDeclaration,
  deployed: DeployedDeclaration,
): number {
  const total = codeLineCount(candidate.body) + codeLineCount(deployed.body)
  return 1 - changedCodeLines(diff) / total
}

function changedCodeLines(diff: SolidityDiff): number {
  return diff.lines.filter(
    (line) => line.type !== 'unchanged' && isCodeLine(line.value),
  ).length
}

function lineCount(source: string): number {
  return source.split('\n').length
}

function codeLineCount(source: string): number {
  return source.split('\n').filter(isCodeLine).length
}

export function isCodeLine(line: string): boolean {
  const trimmed = line.trim()
  if (trimmed.length === 0) {
    return false
  }
  return !(
    trimmed.startsWith('//') ||
    trimmed.startsWith('/*') ||
    trimmed.startsWith('*')
  )
}
