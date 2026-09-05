// The whole loop as one function, shared by the CLI (main.ts) and the web explorer (web/server):
// compile → emit the AST as facts → run Soufflé on rules/*.dl → render report.md, everything written
// to one folder.

import { spawnSync } from 'child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import { type Backend, type CompileResult, compile } from './compile'
import { emitFacts, type Facts } from './emit'
import { renderReport } from './report'

export const RULE_FILES = ['schema.dl', 'concepts.dl', 'lib.dl', 'report.dl']

export interface PipelineOptions {
  /** Source unit name, e.g. `Flat.sol` (also the <unit> prefix of every id). */
  unit: string
  source: string
  outDir: string
  /** Folder with schema.dl / concepts.dl / lib.dl / report.dl. */
  rulesDir: string
  /** Where solc binaries and the release list are cached. */
  cacheDir: string
  backend?: Backend
  solcVersion?: string
  souffle?: string
  jobs?: number
  /** Add `.output` for every derived relation, not just the ones report.dl exports. */
  outputAllRelations?: boolean
  /** Stop after emitting the base facts (no Soufflé, no report). */
  factsOnly?: boolean
}

export interface RuleFile {
  name: string
  text: string
}

export interface PipelineResult {
  outDir: string
  compiled: CompileResult
  /** Layer 0: the AST as facts. */
  facts: Facts
  factsWritten: { rows: number; bytes: number }
  /** Yul nodes carry no id in solc's JSON; this many got synthetic ids. */
  syntheticIds: number
  ruleFiles: RuleFile[]
  /** The concatenated program Soufflé ran (empty when factsOnly). */
  program: string
  /** Derived relation → rows (empty when factsOnly). */
  derived: Map<string, string[][]>
  souffle: { command: string; stderr: string; version: string }
  report: string
  timings: {
    resolveMs: number
    compileMs: number
    emitMs: number
    souffleMs: number
    reportMs: number
  }
}

export class SouffleError extends Error {
  constructor(
    message: string,
    readonly stdout: string,
    readonly stderr: string,
  ) {
    super(message)
  }
}

export function readRuleFiles(rulesDir: string): RuleFile[] {
  return RULE_FILES.map((name) => ({
    name,
    text: readFileSync(join(rulesDir, name), 'utf8'),
  }))
}

/** Every relation declared in the rule files that has no `.output` yet. */
export function undeclaredOutputs(files: RuleFile[]): string[] {
  const text = files.map((f) => f.text).join('\n')
  const declared = [...text.matchAll(/^\.decl\s+(\w+)\s*\(/gm)].map(
    (m) => m[1] ?? '',
  )
  const inputs = new Set(
    [...text.matchAll(/^\.input\s+(\w+)/gm)].map((m) => m[1]),
  )
  const outputs = new Set(
    [...text.matchAll(/^\.output\s+(\w+)/gm)].map((m) => m[1]),
  )
  return declared.filter((r) => r && !inputs.has(r) && !outputs.has(r))
}

export function buildProgram(files: RuleFile[], outputAll: boolean): string {
  const parts = files.map((f) => `// ----- ${f.name} -----\n${f.text}`)
  if (outputAll) {
    const extra = undeclaredOutputs(files)
    if (extra.length > 0) {
      parts.push(
        `// ----- generated: export every intermediate relation for the explorer -----\n${extra
          .map((r) => `.output ${r}`)
          .join('\n')}\n`,
      )
    }
  }
  return parts.join('\n')
}

export function souffleVersion(bin: string): string {
  const run = spawnSync(bin, ['--version'], { encoding: 'utf8' })
  const m = /Version:\s*([^\s(]+)/.exec(run.stdout ?? '')
  return m?.[1] ?? (run.error ? `not found (${run.error.message})` : 'unknown')
}

function readTsv(path: string): string[][] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

export async function runPipeline(
  opts: PipelineOptions,
): Promise<PipelineResult> {
  const { unit, source, outDir, cacheDir } = opts
  const souffle = opts.souffle ?? process.env.SOUFFLE ?? 'souffle'
  const factsDir = join(outDir, 'facts')
  const derivedDir = join(outDir, 'derived')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'source.sol'), source)

  // 1. compile
  const compiled = await compile({
    fileName: unit,
    source,
    cacheDir,
    backend: opts.backend ?? 'native',
    solcVersion: opts.solcVersion,
  })
  writeFileSync(
    join(outDir, 'solc-input.json'),
    JSON.stringify(compiled.input, null, 2),
  )
  writeFileSync(
    join(outDir, 'solc-output.json'),
    JSON.stringify(compiled.output),
  )

  // 2. emit the AST as facts
  const t0 = performance.now()
  const { facts, syntheticIds } = emitFacts({
    unit,
    fileName: unit,
    source,
    output: compiled.output,
    solcVersion: compiled.solcVersion,
  })
  const factsWritten = facts.write(factsDir)
  const emitMs = performance.now() - t0

  const ruleFiles = readRuleFiles(opts.rulesDir)
  const result: PipelineResult = {
    outDir,
    compiled,
    facts,
    factsWritten,
    syntheticIds,
    ruleFiles,
    program: '',
    derived: new Map(),
    souffle: { command: '', stderr: '', version: '' },
    report: '',
    timings: {
      resolveMs: compiled.timings.resolveMs,
      compileMs: compiled.timings.compileMs,
      emitMs,
      souffleMs: 0,
      reportMs: 0,
    },
  }
  if (opts.factsOnly) return result

  // 3. Soufflé
  const program = buildProgram(ruleFiles, opts.outputAllRelations ?? false)
  const programPath = join(outDir, 'program.dl')
  writeFileSync(programPath, program)
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
  if (run.error) {
    throw new SouffleError(
      `could not run '${souffle}': ${run.error.message} (set --souffle or $SOUFFLE)`,
      '',
      '',
    )
  }
  if (run.status !== 0) {
    throw new SouffleError(
      `souffle exited with ${run.status}`,
      run.stdout,
      run.stderr,
    )
  }
  const derived = new Map<string, string[][]>()
  for (const file of readdirSync(derivedDir)
    .filter((f) => f.endsWith('.csv'))
    .sort()) {
    derived.set(file.replace(/\.csv$/, ''), readTsv(join(derivedDir, file)))
  }

  // 4. report
  const t4 = performance.now()
  const report = renderReport({ unit, derivedDir })
  writeFileSync(join(outDir, 'report.md'), report)
  const reportMs = performance.now() - t4

  return {
    ...result,
    program,
    derived,
    souffle: {
      command: [souffle, ...args].join(' '),
      stderr: run.stderr.trim(),
      version: souffleVersion(souffle),
    },
    report,
    timings: { ...result.timings, souffleMs, reportMs },
  }
}
