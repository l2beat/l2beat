// One run = inputs → facts → derived, written to one folder that everything else (the explorer,
// the agent, explain, queries) only reads:
//
//   <run>/run.json              what was run, unit by unit, with counts and timings
//   <run>/rules/*.dl            the library as it was when the run happened
//   <run>/units/<slug>/         per source file: source.sol, solc-input/output.json, facts/*.facts,
//                               program.dl, derived/*.csv, unit.json
//   <run>/discovered.json       the discovery snapshot (project runs)
//   <run>/facts/*.facts         the project stage's input: discovery as facts + every exported unit relation
//   <run>/program.dl            the project program; derived/*.csv what it derived
//   <run>/asks/<n>/             one folder per question asked (see agent.ts)

import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from 'fs'
import { basename, join } from 'path'
import { type CompileResult, compile } from './compile'
import {
  DISCOVERY_RELATIONS,
  discoveryFacts,
  loadProject,
  type Project,
  unitSlug,
} from './discovery'
import { emitFacts, Facts } from './emit'
import { ROOT as SPIKE } from './paths'
import { type Library, loadLibrary, RULE_FILES } from './rules'
import {
  readTsv,
  runSouffle,
  SouffleError,
  type SouffleRun,
  souffleVersion,
} from './souffle'

export type RunInput =
  | { kind: 'project'; dir: string }
  | { kind: 'file'; name: string; source: string }

export interface RunOptions {
  input: RunInput
  outDir: string
  rulesDir: string
  cacheDir: string
  souffle?: string
  jobs?: number
  /** Only these units (relative paths under .flat); default: all. */
  only?: string[]
  /** Keep unit folders that already exist in outDir (iterating on the project rules). */
  reuseUnits?: boolean
  onProgress?: (event: RunProgress) => void
}

export type RunProgress =
  | { type: 'plan'; units: number; missing: number }
  | {
      type: 'unit'
      unit: string
      slug: string
      index: number
      status: 'running'
    }
  | {
      type: 'unit'
      unit: string
      slug: string
      index: number
      status: 'done'
      ms: number
      solcVersion: string
      baseRows: number
      derivedRows: number
    }
  | {
      type: 'unit'
      unit: string
      slug: string
      index: number
      status: 'failed'
      error: string
    }
  | { type: 'project'; status: 'facts' | 'souffle' }

export interface UnitTimings {
  resolveMs: number
  compileMs: number
  emitMs: number
  souffleMs: number
}

export interface UnitSummary {
  unit: string
  slug: string
  /** Project runs: the deployed address this code belongs to and how (self | proxy | implementation). */
  address?: string
  entryName?: string
  codeAddress?: string
  contractName?: string
  role?: string
  bytes: number
  status: 'ok' | 'failed'
  error?: string
  solcVersion?: string
  timings?: UnitTimings
  baseRows?: number
  derivedRows?: number
}

export interface RunMeta {
  kind: 'run'
  id: string
  name: string
  createdAt: string
  input:
    | { kind: 'project'; dir: string; name: string }
    | { kind: 'file'; name: string }
  units: UnitSummary[]
  missing: Array<{
    entryName: string
    contractName: string
    expectedPath: string
  }>
  exported: string[]
  counts: {
    baseRows: number
    unitDerivedRows: number
    discoveryRows: Record<string, number>
    imported: Record<string, number>
    projectDerivedRows: number
  }
  timings: {
    unitsMs: number
    factsMs: number
    souffleMs: number
    totalMs: number
  }
  souffle: { version: string; command: string; stderr: string }
}

/**
 * Writes the `q` shim into a run folder: `./q <command>` runs `tsx src/cli.ts q --run <this folder>`
 * with the node binary this process runs on (resolved through version-manager symlinks).
 */
export function installQ(runDir: string): void {
  let node = process.execPath
  try {
    node = realpathSync(process.execPath)
  } catch {
    // keep the unresolved path
  }
  const shim = `#!/usr/bin/env bash
# q — the commands for this run (./q help). Implemented in ${SPIKE}/src/q.ts.
here="$(cd "$(dirname "\${BASH_SOURCE[0]}")" && pwd)"
node_bin=${JSON.stringify(node)}
if [ ! -x "$node_bin" ]; then node_bin="$(command -v node)"; fi
# tsx's require hook compiles the TypeScript on the fly; its CLI is not used because it opens an IPC
# socket, which a sandbox (codex) forbids.
exec "$node_bin" -r ${JSON.stringify(join(SPIKE, 'node_modules', 'tsx', 'dist', 'cjs', 'index.cjs'))} ${JSON.stringify(join(SPIKE, 'src', 'cli.ts'))} q --run "$here" "$@"
`
  writeFileSync(join(runDir, 'q'), shim)
  chmodSync(join(runDir, 'q'), 0o755)
}

export function unitDir(runDir: string, slug: string): string {
  if (!/^[\w.-]+$/.test(slug)) throw new Error(`bad unit slug ${slug}`)
  return join(runDir, 'units', slug)
}

export function loadRun(runDir: string): RunMeta {
  return JSON.parse(readFileSync(join(runDir, 'run.json'), 'utf8')) as RunMeta
}

/** The library exactly as the run used it (copied into <run>/rules). */
export function runLibrary(runDir: string): Library {
  return loadLibrary(join(runDir, 'rules'))
}

function countRows(dir: string): number {
  if (!existsSync(dir)) return 0
  let n = 0
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.csv') && !f.endsWith('.facts')) continue
    const text = readFileSync(join(dir, f), 'utf8')
    if (text.length === 0) continue
    n += text.split('\n').length - (text.endsWith('\n') ? 1 : 0)
  }
  return n
}

interface UnitResult {
  compiled: CompileResult
  baseRows: number
  syntheticIds: number
  souffle: SouffleRun
  derivedRows: number
  timings: UnitTimings
}

/** compile → facts → unit program → derived, all inside `dir`. */
async function runUnit(
  unit: string,
  source: string,
  dir: string,
  lib: Library,
  opts: RunOptions,
): Promise<UnitResult> {
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'source.sol'), source)
  const compiled = await compile({
    fileName: unit,
    source,
    cacheDir: opts.cacheDir,
    backend: 'native',
  })
  writeFileSync(
    join(dir, 'solc-input.json'),
    JSON.stringify(compiled.input, null, 2),
  )
  writeFileSync(join(dir, 'solc-output.json'), JSON.stringify(compiled.output))
  const t0 = performance.now()
  const { facts, syntheticIds } = emitFacts({
    unit,
    fileName: unit,
    source,
    output: compiled.output,
    solcVersion: compiled.solcVersion,
  })
  const factsDir = join(dir, 'facts')
  const written = facts.write(factsDir)
  const emitMs = performance.now() - t0
  const programPath = join(dir, 'program.dl')
  writeFileSync(programPath, lib.unitProgram)
  const derivedDir = join(dir, 'derived')
  mkdirSync(derivedDir, { recursive: true })
  const souffle = runSouffle({
    program: programPath,
    facts: factsDir,
    out: derivedDir,
    souffle: opts.souffle,
    jobs: opts.jobs,
  })
  return {
    compiled,
    baseRows: written.rows,
    syntheticIds,
    souffle,
    derivedRows: countRows(derivedDir),
    timings: {
      resolveMs: compiled.timings.resolveMs,
      compileMs: compiled.timings.compileMs,
      emitMs,
      souffleMs: souffle.ms,
    },
  }
}

interface PlannedUnit {
  unit: string
  slug: string
  source: () => string
  bytes: number
  address?: string
  entryName?: string
  codeAddress?: string
  contractName?: string
  role?: string
}

export async function runAll(opts: RunOptions): Promise<RunMeta> {
  const started = performance.now()
  const { outDir } = opts
  mkdirSync(outDir, { recursive: true })
  // the library, frozen with the run
  const rulesCopy = join(outDir, 'rules')
  mkdirSync(rulesCopy, { recursive: true })
  for (const f of RULE_FILES)
    if (existsSync(join(opts.rulesDir, f)))
      copyFileSync(join(opts.rulesDir, f), join(rulesCopy, f))
  const lib = loadLibrary(rulesCopy)

  let project: Project | undefined
  let planned: PlannedUnit[]
  let name: string
  if (opts.input.kind === 'project') {
    project = loadProject(opts.input.dir)
    name = project.name
    copyFileSync(project.discoveredPath, join(outDir, 'discovered.json'))
    const units = opts.only
      ? project.units.filter((u) => opts.only?.includes(u.unit))
      : project.units
    planned = units.map((u) => ({
      unit: u.unit,
      slug: u.slug,
      source: () => readFileSync(u.path, 'utf8'),
      bytes: u.bytes,
      address: u.address,
      entryName: u.entryName,
      codeAddress: u.codeAddress,
      contractName: u.contractName,
      role: u.role,
    }))
  } else {
    const file = opts.input
    const unit = file.name.endsWith('.sol') ? file.name : `${file.name}.sol`
    name = basename(unit, '.sol')
    planned = [
      {
        unit,
        slug: unitSlug(unit),
        source: () => file.source,
        bytes: Buffer.byteLength(file.source),
      },
    ]
  }
  opts.onProgress?.({
    type: 'plan',
    units: planned.length,
    missing: project?.missing.length ?? 0,
  })

  // 1. the unit stage
  const t0 = performance.now()
  const summaries: UnitSummary[] = []
  for (const [index, p] of planned.entries()) {
    const dir = unitDir(outDir, p.slug)
    const base = {
      unit: p.unit,
      slug: p.slug,
      address: p.address,
      entryName: p.entryName,
      codeAddress: p.codeAddress,
      contractName: p.contractName,
      role: p.role,
      bytes: p.bytes,
    }
    const previous = join(dir, 'unit.json')
    if (opts.reuseUnits && existsSync(previous)) {
      const meta = JSON.parse(readFileSync(previous, 'utf8')) as UnitSummary
      summaries.push({ ...base, ...meta, status: meta.status })
      opts.onProgress?.({
        type: 'unit',
        unit: p.unit,
        slug: p.slug,
        index,
        status: 'done',
        ms: 0,
        solcVersion: meta.solcVersion ?? 'reused',
        baseRows: meta.baseRows ?? 0,
        derivedRows: meta.derivedRows ?? 0,
      })
      continue
    }
    opts.onProgress?.({
      type: 'unit',
      unit: p.unit,
      slug: p.slug,
      index,
      status: 'running',
    })
    const unitStart = performance.now()
    let summary: UnitSummary
    try {
      const r = await runUnit(p.unit, p.source(), dir, lib, opts)
      summary = {
        ...base,
        status: 'ok',
        solcVersion: r.compiled.solcVersion,
        timings: r.timings,
        baseRows: r.baseRows,
        derivedRows: r.derivedRows,
      }
      writeFileSync(
        join(dir, 'unit.json'),
        JSON.stringify(
          {
            ...summary,
            resolvedFrom: r.compiled.resolvedFrom,
            syntheticIds: r.syntheticIds,
            souffle: r.souffle,
          },
          null,
          2,
        ),
      )
      opts.onProgress?.({
        type: 'unit',
        unit: p.unit,
        slug: p.slug,
        index,
        status: 'done',
        ms: performance.now() - unitStart,
        solcVersion: r.compiled.solcVersion,
        baseRows: r.baseRows,
        derivedRows: r.derivedRows,
      })
    } catch (error) {
      const message =
        error instanceof SouffleError
          ? `${error.message}\n${error.stderr}`.trim()
          : error instanceof Error
            ? error.message
            : String(error)
      summary = { ...base, status: 'failed', error: message }
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'error.txt'), message)
      writeFileSync(join(dir, 'unit.json'), JSON.stringify(summary, null, 2))
      opts.onProgress?.({
        type: 'unit',
        unit: p.unit,
        slug: p.slug,
        index,
        status: 'failed',
        error: message,
      })
    }
    summaries.push(summary)
  }
  const unitsMs = performance.now() - t0

  // 2. the project stage's input: discovery as facts + the union of the exported unit relations
  opts.onProgress?.({ type: 'project', status: 'facts' })
  const t1 = performance.now()
  const factsDir = join(outDir, 'facts')
  mkdirSync(factsDir, { recursive: true })
  const discovery = project
    ? discoveryFacts({
        ...project,
        // a unit that failed to compile contributes no code: leave its dUnit rows out
        units: project.units.filter((u) =>
          summaries.some((s) => s.unit === u.unit && s.status === 'ok'),
        ),
      })
    : new Facts(DISCOVERY_RELATIONS)
  discovery.write(factsDir)
  const imported: Record<string, number> = {}
  for (const relation of lib.exported) {
    const parts: string[] = []
    let rows = 0
    for (const s of summaries) {
      if (s.status !== 'ok') continue
      const path = join(unitDir(outDir, s.slug), 'derived', `${relation}.csv`)
      if (!existsSync(path)) continue
      const text = readFileSync(path, 'utf8')
      if (text.length === 0) continue
      parts.push(text.endsWith('\n') ? text : `${text}\n`)
      rows += text.split('\n').length - (text.endsWith('\n') ? 1 : 0)
    }
    writeFileSync(join(factsDir, `${relation}.facts`), parts.join(''))
    imported[relation] = rows
  }
  const factsMs = performance.now() - t1

  // 3. the project program
  opts.onProgress?.({ type: 'project', status: 'souffle' })
  const programPath = join(outDir, 'program.dl')
  writeFileSync(programPath, lib.projectProgram)
  const derivedDir = join(outDir, 'derived')
  mkdirSync(derivedDir, { recursive: true })
  const souffle = runSouffle({
    program: programPath,
    facts: factsDir,
    out: derivedDir,
    souffle: opts.souffle,
    jobs: opts.jobs,
  })

  const discoveryRows: Record<string, number> = {}
  for (const r of Object.keys(DISCOVERY_RELATIONS))
    discoveryRows[r] = discovery.count(r)
  const meta: RunMeta = {
    kind: 'run',
    id: basename(outDir),
    name,
    createdAt: new Date().toISOString(),
    input:
      opts.input.kind === 'project'
        ? { kind: 'project', dir: opts.input.dir, name }
        : { kind: 'file', name: planned[0]?.unit ?? name },
    units: summaries,
    missing: (project?.missing ?? []).map((m) => ({
      entryName: m.entryName,
      contractName: m.contractName,
      expectedPath: m.expectedPath,
    })),
    exported: lib.exported,
    counts: {
      baseRows: summaries.reduce((n, s) => n + (s.baseRows ?? 0), 0),
      unitDerivedRows: summaries.reduce((n, s) => n + (s.derivedRows ?? 0), 0),
      discoveryRows,
      imported,
      projectDerivedRows: countRows(derivedDir),
    },
    timings: {
      unitsMs,
      factsMs,
      souffleMs: souffle.ms,
      totalMs: performance.now() - started,
    },
    souffle: {
      version: souffleVersion(opts.souffle),
      command: souffle.command,
      stderr: souffle.stderr,
    },
  }
  writeFileSync(join(outDir, 'run.json'), JSON.stringify(meta, null, 2))
  installQ(outDir)
  return meta
}

/** Rows of a derived or input relation of the project stage, or of one unit. */
export function readRelation(
  runDir: string,
  relation: string,
  slug?: string,
): string[][] {
  if (!/^\w+$/.test(relation)) throw new Error(`bad relation ${relation}`)
  const dir = slug ? unitDir(runDir, slug) : runDir
  const derived = join(dir, 'derived', `${relation}.csv`)
  if (existsSync(derived)) return readTsv(derived)
  return readTsv(join(dir, 'facts', `${relation}.facts`))
}
