import { resolve } from 'path'
import type { FlatWorkspace } from '../FlatWorkspace'
import {
  type Definition,
  type DefinitionResult,
  resolveDefinition,
} from '../resolveDefinition'
import type { OracleSite, TruthTarget } from './oracle'

// correct: every answer is a right one; almost: the right one is in a list;
// wrong: only other code; miss: no implementation (just an interface or nothing).
// For calls nobody can resolve statically we only record whether we guessed.
export type Verdict =
  | 'correct'
  | 'almost'
  | 'wrong'
  | 'miss'
  | 'dynamic: honest'
  | 'dynamic: guessed'
  | 'oracle unknown'

export interface JudgedSite {
  site: OracleSite
  verdict: Verdict
  location: string
  expected: string
  ours: string[]
}

export function judgeSites(
  workspace: FlatWorkspace,
  sites: OracleSite[],
): JudgedSite[] {
  return sites.map((site) => {
    const result = resolveDefinition(workspace, site.path, site.offset)
    return {
      site,
      verdict: judge(workspace, site, result),
      location: locate(workspace, site.path, site.offset),
      expected: describeTruth(workspace, site),
      ours: result.definitions.map((d) => describe(d)),
    }
  })
}

function judge(
  workspace: FlatWorkspace,
  site: OracleSite,
  result: DefinitionResult,
): Verdict {
  const implemented = result.definitions.filter(isImplementation)
  const { truth } = site
  switch (truth.kind) {
    case 'unknown':
      return 'oracle unknown'
    case 'dynamic':
      return implemented.length === 1 ? 'dynamic: guessed' : 'dynamic: honest'
    case 'outside':
      if (implemented.length > 0) {
        return 'wrong'
      }
      return result.receiver?.address === truth.address ? 'correct' : 'miss'
    case 'known': {
      if (implemented.length === 0) {
        return 'miss'
      }
      const hits = implemented.filter((d) =>
        truth.targets.some((t) => isWithin(workspace, d, t)),
      )
      if (hits.length === implemented.length) {
        return 'correct'
      }
      return hits.length > 0 ? 'almost' : 'wrong'
    }
  }
}

function isImplementation(definition: Definition): boolean {
  const node = definition.declaration as { type: string; body?: unknown }
  return node.type !== 'FunctionDefinition' || node.body !== null
}

function isWithin(
  workspace: FlatWorkspace,
  definition: Definition,
  target: TruthTarget,
): boolean {
  if (resolve(definition.path) !== resolve(target.path)) {
    return false
  }
  const offset = workspace.source(definition.path).offsetOf(definition.position)
  return target.start <= offset && offset < target.end
}

function describeTruth(workspace: FlatWorkspace, site: OracleSite): string {
  const { truth } = site
  switch (truth.kind) {
    case 'known':
      return truth.targets
        .map((t) => locate(workspace, t.path, t.start))
        .join(', ')
    case 'outside':
      return `outside ${truth.address}`
    default:
      return `${truth.kind}: ${truth.reason}`
  }
}

function locate(
  workspace: FlatWorkspace,
  path: string,
  offset: number,
): string {
  const { line } = workspace.source(path).positionOf(offset)
  return `${path.split('/.flat/')[1] ?? path}:${line}`
}

function describe(definition: Definition): string {
  const { label, position, resolution, path } = definition
  const file = path.split('/.flat/')[1] ?? path
  return `${label} ${file}:${position.line} [${resolution}]`
}
