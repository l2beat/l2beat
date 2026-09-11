// Why does a tuple hold? Soufflé answers for one program at a time; a run has several (the query, the
// project stage, one per unit). This module finds the program a tuple belongs to, asks there, and
// marks the leaves that are themselves derived somewhere else, so a reader (or ./q why) can continue.

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { loadRun, type RunMeta, runLibrary, unitDir } from './pipeline'
import type { QueryResult } from './query'
import type { Library } from './rules'
import { explainAtom, formatAtom, type ProofNode, splitAtom } from './souffle'

export type HomeStage = 'query' | 'project' | 'unit' | 'discovery' | 'solidity'

/** Where a tuple lives: which program derives it (or which input file states it). */
export interface Home {
  stage: HomeStage
  /** Unit slug for unit-stage tuples and unit-level query tuples. */
  slug?: string
  /** Query name for query tuples. */
  query?: string
  /** The program to ask (undefined for facts). */
  program?: string
  /** The fact directory that program reads (its own folder for queries: file names are absolute). */
  facts?: string
}

export interface Located {
  relation: string
  cols: string[]
  atom: string
  home: Home
}

function rowIn(path: string, row: string): boolean {
  if (!existsSync(path)) return false
  const text = readFileSync(path, 'utf8')
  return text.startsWith(`${row}\n`) || text.includes(`\n${row}\n`)
}

/** Units whose name prefixes some column value, most likely first. */
function unitsByPrefix(meta: RunMeta, cols: string[]): string[] {
  const hits = new Set<string>()
  for (const u of meta.units) {
    if (u.status !== 'ok') continue
    for (const c of cols)
      if (c.startsWith(`${u.unit}:`) || c === u.unit) hits.add(u.slug)
  }
  const rest = meta.units
    .filter((u) => u.status === 'ok' && !hits.has(u.slug))
    .map((u) => u.slug)
  return [...hits, ...rest]
}

/**
 * Finds the home of `rel(cols)`. Queries first (the folders in `queryDirs`), then the project stage,
 * then the unit that has the row.
 */
export function locate(
  runDirIn: string,
  relation: string,
  cols: string[],
  opts: { queryDirs?: string[]; meta?: RunMeta; lib?: Library } = {},
): Located | undefined {
  const runDir = resolve(runDirIn)
  const meta = opts.meta ?? loadRun(runDir)
  const lib = opts.lib ?? runLibrary(runDir)
  const row = cols.join('\t')
  for (const qdir of opts.queryDirs ?? []) {
    const resultPath = join(qdir, 'result.json')
    if (!existsSync(resultPath)) continue
    const result = JSON.parse(readFileSync(resultPath, 'utf8')) as QueryResult
    const decl = result.declared.find((d) => d.name === relation)
    if (!decl) continue
    const atom = formatAtom(relation, cols, decl.columns)
    if (result.level === 'project')
      return {
        relation,
        cols,
        atom,
        home: {
          stage: 'query',
          query: result.name,
          program: join(qdir, 'program.dl'),
          facts: qdir,
        },
      }
    for (const slug of result.units ?? [])
      if (rowIn(join(qdir, 'units', slug, 'out', `${relation}.csv`), row))
        return {
          relation,
          cols,
          atom,
          home: {
            stage: 'query',
            query: result.name,
            slug,
            program: join(qdir, 'units', slug, 'program.dl'),
            facts: join(qdir, 'units', slug),
          },
        }
    return undefined
  }
  const rec = lib.relations.get(relation)
  if (!rec) return undefined
  const atom = formatAtom(relation, cols, rec.columns)
  if (rec.stage === 'project') {
    if (rec.kind === 'input')
      return { relation, cols, atom, home: { stage: 'discovery' } }
    return {
      relation,
      cols,
      atom,
      home: {
        stage: 'project',
        program: join(runDir, 'program.dl'),
        facts: join(runDir, 'facts'),
      },
    }
  }
  for (const slug of unitsByPrefix(meta, cols)) {
    const dir = unitDir(runDir, slug)
    const path =
      rec.kind === 'input'
        ? join(dir, 'facts', `${relation}.facts`)
        : join(dir, 'derived', `${relation}.csv`)
    if (!rowIn(path, row)) continue
    if (rec.kind === 'input')
      return { relation, cols, atom, home: { stage: 'solidity', slug } }
    return {
      relation,
      cols,
      atom,
      home: {
        stage: 'unit',
        slug,
        program: join(dir, 'program.dl'),
        facts: join(dir, 'facts'),
      },
    }
  }
  return undefined
}

/** Marks every leaf that is derived elsewhere with its stage, so it can be explained further. */
function annotate(node: ProofNode, lib: Library, here: Home): void {
  if (node.kind === 'fact') {
    const relation = /^(\w+)\(/.exec(node.text)?.[1] ?? ''
    const rec = lib.relations.get(relation)
    if (!rec) {
      // a relation of the query itself, read back? (cannot happen: queries are not inputs)
      return
    }
    if (rec.kind === 'input')
      node.stage = rec.stage === 'project' ? 'discovery' : 'solidity'
    else if (here.stage === 'query' || rec.stage !== here.stage)
      node.stage = rec.stage
    else node.stage = here.stage
    return
  }
  for (const c of node.children) annotate(c, lib, here)
}

export interface Explained {
  located: Located
  proof: ProofNode
  ms: number
}

/** The proof tree of an atom, asked in the program that derives it; leaves marked with where they come from. */
export function explainAnywhere(
  runDirIn: string,
  atomText: string,
  opts: { queryDirs?: string[]; depth?: number; souffle?: string } = {},
): Explained {
  const runDir = resolve(runDirIn)
  const meta = loadRun(runDir)
  const lib = runLibrary(runDir)
  const parsed = splitAtom(atomText)
  if (!parsed) throw new Error(`not an atom: ${atomText}`)
  const located = locate(runDir, parsed.relation, parsed.cols, {
    queryDirs: opts.queryDirs,
    meta,
    lib,
  })
  if (!located)
    throw new Error(
      `no tuple ${atomText} in this run (unknown relation, or the row was not derived)`,
    )
  if (!located.home.program || !located.home.facts) {
    // a fact: nothing to explain
    return {
      located,
      proof: {
        kind: 'fact',
        text: located.atom,
        children: [],
        stage: located.home.stage,
      },
      ms: 0,
    }
  }
  const t0 = performance.now()
  const { proof } = explainAtom({
    programPath: located.home.program,
    factsDir: located.home.facts,
    atom: located.atom,
    depth: opts.depth,
    souffle: opts.souffle,
  })
  annotate(proof, lib, located.home)
  proof.stage = located.home.stage
  return { located, proof, ms: performance.now() - t0 }
}

/** All query folders of a run (every ask's queries and the run's own), for locating query tuples. */
export function allQueryDirs(runDirIn: string): string[] {
  const runDir = resolve(runDirIn)
  const out: string[] = []
  const collect = (base: string) => {
    const q = join(base, 'queries')
    if (!existsSync(q)) return
    for (const d of readdirSync(q).sort()) out.push(join(q, d))
  }
  collect(runDir)
  const asks = join(runDir, 'asks')
  if (existsSync(asks))
    for (const a of readdirSync(asks).sort()) collect(join(asks, a))
  return out
}
