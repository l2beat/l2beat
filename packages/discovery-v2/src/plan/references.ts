/**
 * Where a step may point at other data, and what it points at.
 *
 * The validator and the executor must agree on which positions in a step
 * hold references and how a reference is read, otherwise a plan could pass
 * validation and then fail to resolve. Both import this module instead of
 * each having a copy of the rules. Cycle detection lives here for the same
 * reason: the validator reports cycles, and the executor refuses to run them.
 */
import type { Step } from './Plan'

export type ParsedReference =
  | { kind: 'baseline'; field: string }
  | { kind: 'step'; id: string }
  | { kind: 'self' }

const REFERENCE =
  /^\$(self|baseline\.([A-Za-z_$][A-Za-z0-9_$]*)|step\.([A-Za-z_$][A-Za-z0-9_$]*))$/

export function parseReference(value: unknown): ParsedReference | undefined {
  if (typeof value !== 'string') {
    return undefined
  }
  const match = REFERENCE.exec(value)
  if (match === null) {
    return undefined
  }
  if (match[2] !== undefined) {
    return { kind: 'baseline', field: match[2] }
  }
  if (match[3] !== undefined) {
    return { kind: 'step', id: match[3] }
  }
  return { kind: 'self' }
}

export function isReference(value: unknown): value is string {
  return parseReference(value) !== undefined
}

export interface ReferenceSite {
  /** Path inside the step, e.g. `fetch.at` or `fetch.args[1]`. */
  path: string
  raw: string
  reference: ParsedReference
}

/** Every reference a step's fetch holds, with the path it sits at. */
export function collectReferences(step: Step): ReferenceSite[] {
  const sites: ReferenceSite[] = []
  const add = (path: string, value: unknown) => {
    const reference = parseReference(value)
    if (reference !== undefined) {
      sites.push({ path, raw: value as string, reference })
    }
  }
  const fetch = step.fetch
  if ('at' in fetch) {
    add('fetch.at', fetch.at)
  }
  if (fetch.kind === 'call') {
    fetch.args?.forEach((arg, i) => add(`fetch.args[${i}]`, arg))
  }
  if (fetch.kind === 'callEach') {
    if ('from' in fetch.keys) {
      add('fetch.keys.from', fetch.keys.from)
    }
    if ('range' in fetch.keys) {
      add('fetch.keys.range.length', fetch.keys.range.length)
    }
  }
  return sites
}

/** Ids of the steps this step reads through `$step.<id>`. */
export function stepDependencies(step: Step): string[] {
  const ids = collectReferences(step)
    .map((site) => site.reference)
    .filter((reference) => reference.kind === 'step')
    .map((reference) => reference.id)
  return [...new Set(ids)]
}

/**
 * Every dependency cycle among the steps, each as the ids along the cycle
 * starting and ending at the same id. References to ids that do not exist
 * are not edges; the validator reports those separately.
 */
export function findCycles(steps: readonly Step[]): string[][] {
  const edges = new Map<string, string[]>()
  for (const step of steps) {
    if (!edges.has(step.id)) {
      edges.set(step.id, stepDependencies(step))
    }
  }
  const cycles: string[][] = []
  const state = new Map<string, 'visiting' | 'done'>()
  const stack: string[] = []

  const visit = (id: string) => {
    if (state.get(id) === 'done') {
      return
    }
    if (state.get(id) === 'visiting') {
      cycles.push([...stack.slice(stack.indexOf(id)), id])
      return
    }
    state.set(id, 'visiting')
    stack.push(id)
    for (const next of edges.get(id) ?? []) {
      if (edges.has(next)) {
        visit(next)
      }
    }
    stack.pop()
    state.set(id, 'done')
  }

  for (const step of steps) {
    visit(step.id)
  }
  return cycles
}
