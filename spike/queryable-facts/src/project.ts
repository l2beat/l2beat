// A project run: the unit pipeline once per flattened file of a discovery project, then the project
// program (rules/project-schema.dl + rules/project.dl) over discovery's facts and the union of what the
// units derived. Everything lands in one folder:
//
//   <out>/units/<slug>/      one full unit run each (source.sol, facts/, derived/, program.dl, report.md, qf)
//   <out>/discovery/facts/   discovery as facts (d* relations)
//   <out>/facts/             what the project program read: the d* facts + every unit's rows of each imported relation
//   <out>/program.dl         the project program Soufflé ran
//   <out>/derived/           the project relations
//   <out>/report.md          the project report; qf, qf.mjs; run.json; README.txt

import { spawnSync } from 'child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { dirname, join } from 'path'
import type { Backend } from './compile'
import {
  DISCOVERY_RELATIONS,
  discoveryFacts,
  loadProject,
  type Project,
  type ProjectUnit,
} from './discovery'
import type { Facts } from './emit'
import {
  buildProgram,
  installQf,
  type PipelineResult,
  type RuleFile,
  runPipeline,
  SouffleError,
  souffleVersion,
} from './pipeline'
import { renderProjectReport } from './projectReport'

export const PROJECT_RULE_FILES = ['project-schema.dl', 'project.dl']

export interface ProjectRunOptions {
  /** packages/config/src/projects/<name>, or any folder with discovered.json and .flat/. */
  projectDir: string
  outDir: string
  rulesDir: string
  cacheDir: string
  qfScript?: string
  backend?: Backend
  souffle?: string
  jobs?: number
  /** Add `.output` for every relation of the unit and project programs (the explorer needs them). */
  outputAllRelations?: boolean
  /** Only these units (relative paths under .flat); default: all. */
  only?: string[]
  /** Keep unit runs that already exist in the output folder (for iterating on the project rules). */
  reuseUnits?: boolean
  onProgress?: (event: ProjectProgress) => void
}

export type ProjectProgress =
  | { type: 'plan'; units: number; missing: number }
  | { type: 'unit'; unit: string; index: number; status: 'running' }
  | {
      type: 'unit'
      unit: string
      index: number
      status: 'done'
      ms: number
      solcVersion: string
    }
  | {
      type: 'unit'
      unit: string
      index: number
      status: 'failed'
      error: string
    }
  | { type: 'project'; status: 'facts' | 'souffle' | 'report' }

export interface UnitRunSummary extends ProjectUnit {
  status: 'ok' | 'failed'
  error?: string
  solcVersion?: string
  timings?: PipelineResult['timings']
  baseRows?: number
  derivedRows?: number
  /** unhandled(Ctx, What, Text) rows: extractor coverage. */
  unhandled?: number
  runDir: string
}

export interface ProjectRunResult {
  project: Project
  outDir: string
  units: UnitRunSummary[]
  discovery: Facts
  /** Rows per imported unit relation, after concatenation. */
  imported: Record<string, number>
  ruleFiles: RuleFile[]
  program: string
  derived: Map<string, string[][]>
  souffle: { command: string; stderr: string; version: string }
  report: string
  timings: {
    unitsMs: number
    factsMs: number
    souffleMs: number
    reportMs: number
  }
}

export function readProjectRuleFiles(rulesDir: string): RuleFile[] {
  return PROJECT_RULE_FILES.map((name) => ({
    name,
    text: readFileSync(join(rulesDir, name), 'utf8'),
  }))
}

/** The unit relations the project program imports: every `.input` of project-schema.dl that is not a discovery relation. */
export function importedRelations(schema: string): string[] {
  return [...schema.matchAll(/^\.input\s+(\w+)/gm)]
    .map((m) => m[1] ?? '')
    .filter((r) => r && !(r in DISCOVERY_RELATIONS))
}

function readTsv(path: string): string[][] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

export const PROJECT_README = `This folder is one project run of the queryable-facts pipeline (spike/queryable-facts): every flattened
contract of a discovery project, plus discovery's snapshot of their values, put together.

  discovered.json          discovery's output, copied
  discovery/facts/*.facts  discovery written down as facts (dEntry, dImpl, dUnit, dValue, dPermission), by src/discovery.ts
  units/<slug>/            one complete unit run per flattened file: source.sol, facts/, derived/, program.dl, report.md, ./qf
  facts/*.facts            what the project program read: the discovery facts, and for each imported unit relation
                           (function, entryPoint, storageWriters, finding, extCall, ...) the rows of every unit
  program.dl               rules/project-schema.dl (declarations) + rules/project.dl (layers 7-9: deployment, values, authority)
  derived/<rel>.csv        the project relations: codeOf, valueOf, refersTo, allowed, acts, crossCall, relayed, canCall,
                           whoCanWrite, unresolvedCheck, crossCallGap, permissionCheck, ...
  report.md                the project report: contracts and their code, actors, who can change what, gaps
  qf, qf.mjs               the query commands in project mode: ./qf help
  run.json                 metadata: units, timings, counts
  ask/<n>-*.md             transcripts of questions asked in the explorer

Start with:                          ./qf help
The deployed contracts:              ./qf contracts
One contract, its values, callers:   ./qf contract SuperchainConfig
Who can change a variable:           ./qf writers SuperchainConfig.guardian
Every way to reach an entry point:   ./qf paths SuperchainConfig.pause
What an actor is and can do:         ./qf who "Optimism Security Council"
Why a project tuple holds:           ./qf explain 'allowed("...", "...", "...", "...", "checked")'
A unit's own commands:               units/<slug>/qf help
`

export async function runProject(
  opts: ProjectRunOptions,
): Promise<ProjectRunResult> {
  const project = loadProject(opts.projectDir)
  const souffle = opts.souffle ?? process.env.SOUFFLE ?? 'souffle'
  const { outDir } = opts
  mkdirSync(outDir, { recursive: true })
  writeFileSync(
    join(outDir, 'discovered.json'),
    readFileSync(project.discoveredPath),
  )
  const units = opts.only
    ? project.units.filter((u) => opts.only?.includes(u.unit))
    : project.units
  opts.onProgress?.({
    type: 'plan',
    units: units.length,
    missing: project.missing.length,
  })

  // 1. the unit pipeline, once per flattened file
  const t0 = performance.now()
  const summaries: UnitRunSummary[] = []
  for (const [index, unit] of units.entries()) {
    const runDir = join(outDir, 'units', unit.slug)
    const previous = join(runDir, 'run.json')
    if (opts.reuseUnits && existsSync(previous)) {
      const meta = JSON.parse(readFileSync(previous, 'utf8')) as {
        solcVersion?: string
        timings?: PipelineResult['timings']
        baseRows?: number
        derivedRows?: number
      }
      summaries.push({
        ...unit,
        status: 'ok',
        solcVersion: meta.solcVersion,
        timings: meta.timings,
        baseRows: meta.baseRows,
        derivedRows: meta.derivedRows,
        unhandled: readTsv(join(runDir, 'derived', 'unhandled.csv')).length,
        runDir,
      })
      opts.onProgress?.({
        type: 'unit',
        unit: unit.unit,
        index,
        status: 'done',
        ms: 0,
        solcVersion: meta.solcVersion ?? 'reused',
      })
      continue
    }
    opts.onProgress?.({
      type: 'unit',
      unit: unit.unit,
      index,
      status: 'running',
    })
    const started = performance.now()
    try {
      const result = await runPipeline({
        unit: unit.unit,
        source: readFileSync(unit.path, 'utf8'),
        outDir: runDir,
        rulesDir: opts.rulesDir,
        cacheDir: opts.cacheDir,
        qfScript: opts.qfScript,
        backend: opts.backend,
        souffle,
        jobs: opts.jobs,
        outputAllRelations: opts.outputAllRelations,
      })
      const derivedRows = [...result.derived.values()].reduce(
        (n, rows) => n + rows.length,
        0,
      )
      const summary: UnitRunSummary = {
        ...unit,
        status: 'ok',
        solcVersion: result.compiled.solcVersion,
        timings: result.timings,
        baseRows: result.factsWritten.rows,
        derivedRows,
        unhandled: result.derived.get('unhandled')?.length ?? 0,
        runDir,
      }
      summaries.push(summary)
      writeFileSync(
        join(runDir, 'run.json'),
        JSON.stringify(
          {
            kind: 'unit',
            unit: unit.unit,
            project: project.name,
            address: unit.address,
            codeAddress: unit.codeAddress,
            role: unit.role,
            entryName: unit.entryName,
            solcVersion: result.compiled.solcVersion,
            resolvedFrom: result.compiled.resolvedFrom,
            souffle: result.souffle,
            timings: result.timings,
            baseRows: result.factsWritten.rows,
            derivedRows,
            syntheticIds: result.syntheticIds,
          },
          null,
          2,
        ),
      )
      opts.onProgress?.({
        type: 'unit',
        unit: unit.unit,
        index,
        status: 'done',
        ms: performance.now() - started,
        solcVersion: result.compiled.solcVersion,
      })
    } catch (error) {
      const message =
        error instanceof SouffleError
          ? `${error.message}\n${error.stderr}`.trim()
          : error instanceof Error
            ? error.message
            : String(error)
      summaries.push({ ...unit, status: 'failed', error: message, runDir })
      mkdirSync(runDir, { recursive: true })
      writeFileSync(join(runDir, 'error.txt'), message)
      opts.onProgress?.({
        type: 'unit',
        unit: unit.unit,
        index,
        status: 'failed',
        error: message,
      })
    }
  }
  const unitsMs = performance.now() - t0

  // 2. the project's input facts: discovery + the union of the imported unit relations
  opts.onProgress?.({ type: 'project', status: 'facts' })
  const t1 = performance.now()
  const discovery = discoveryFacts({
    ...project,
    // a unit that failed to compile contributes no code: leave its dUnit rows out so codeGap reports it
    units: project.units.filter((u) =>
      summaries.some((s) => s.unit === u.unit && s.status === 'ok'),
    ),
  })
  discovery.write(join(outDir, 'discovery', 'facts'))
  const factsDir = join(outDir, 'facts')
  mkdirSync(factsDir, { recursive: true })
  discovery.write(factsDir)
  const ruleFiles = readProjectRuleFiles(opts.rulesDir)
  const schema =
    ruleFiles.find((f) => f.name === 'project-schema.dl')?.text ?? ''
  const imported: Record<string, number> = {}
  for (const relation of importedRelations(schema)) {
    const lines: string[] = []
    for (const s of summaries) {
      if (s.status !== 'ok') continue
      const path = join(s.runDir, 'derived', `${relation}.csv`)
      if (!existsSync(path)) continue
      const text = readFileSync(path, 'utf8')
      if (text.length > 0) lines.push(text.endsWith('\n') ? text : `${text}\n`)
    }
    const content = lines.join('')
    writeFileSync(join(factsDir, `${relation}.facts`), content)
    imported[relation] = content === '' ? 0 : content.split('\n').length - 1
  }
  const factsMs = performance.now() - t1

  // 3. Soufflé on the project program
  opts.onProgress?.({ type: 'project', status: 'souffle' })
  const program = buildProgram(ruleFiles, opts.outputAllRelations ?? false)
  const programPath = join(outDir, 'program.dl')
  writeFileSync(programPath, program)
  const derivedDir = join(outDir, 'derived')
  mkdirSync(derivedDir, { recursive: true })
  const args = [
    '--no-preprocessor',
    `-j${opts.jobs ?? 1}`,
    '-F',
    factsDir,
    '-D',
    derivedDir,
    programPath,
  ]
  const t2 = performance.now()
  const run = spawnSync(souffle, args, { encoding: 'utf8' })
  const souffleMs = performance.now() - t2
  if (run.error)
    throw new SouffleError(
      `could not run '${souffle}': ${run.error.message}`,
      '',
      '',
    )
  if (run.status !== 0)
    throw new SouffleError(
      `souffle exited with ${run.status} on the project program`,
      run.stdout,
      run.stderr,
    )
  const derived = new Map<string, string[][]>()
  for (const file of readdirSync(derivedDir)
    .filter((f) => f.endsWith('.csv'))
    .sort())
    derived.set(file.replace(/\.csv$/, ''), readTsv(join(derivedDir, file)))

  // 4. report, qf, metadata
  opts.onProgress?.({ type: 'project', status: 'report' })
  const t3 = performance.now()
  const report = renderProjectReport({
    project,
    units: summaries,
    derived,
    discovery,
  })
  writeFileSync(join(outDir, 'report.md'), report)
  installQf(
    outDir,
    opts.qfScript ?? join(dirname(opts.rulesDir), 'src', 'qf.mjs'),
  )
  writeFileSync(join(outDir, 'README.txt'), PROJECT_README)
  const reportMs = performance.now() - t3
  const souffleInfo = {
    command: [souffle, ...args].join(' '),
    stderr: run.stderr.trim(),
    version: souffleVersion(souffle),
  }
  writeFileSync(
    join(outDir, 'run.json'),
    JSON.stringify(
      {
        kind: 'project',
        project: project.name,
        projectDir: project.dir,
        units: summaries.map((s) => ({
          unit: s.unit,
          slug: s.slug,
          address: s.address,
          codeAddress: s.codeAddress,
          contractName: s.contractName,
          role: s.role,
          entryName: s.entryName,
          status: s.status,
          error: s.error,
          solcVersion: s.solcVersion,
          timings: s.timings,
          baseRows: s.baseRows,
          derivedRows: s.derivedRows,
        })),
        missing: project.missing,
        imported,
        souffle: souffleInfo,
        timings: { unitsMs, factsMs, souffleMs, reportMs },
        derivedRows: [...derived.values()].reduce((n, r) => n + r.length, 0),
      },
      null,
      2,
    ),
  )
  return {
    project,
    outDir,
    units: summaries,
    discovery,
    imported,
    ruleFiles,
    program,
    derived,
    souffle: souffleInfo,
    report,
    timings: { unitsMs, factsMs, souffleMs, reportMs },
  }
}
