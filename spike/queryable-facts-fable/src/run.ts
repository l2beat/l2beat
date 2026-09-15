// Running one example at one level: compile once (cached by the source hash), emit facts, run
// Soufflé with the rule files 0..level, keep everything under out/<example>/.
//
//   out/<example>/facts/          the level-0 rows, `<relation>.facts`, plus source.sol and ast.json
//   out/<example>/L<n>/program.dl the concatenated rules
//   out/<example>/L<n>/derived/   `<relation>.csv` for every `.output` relation
//   out/<example>/L<n>/run.json   what happened: compiler, timings, row counts

import { createHash } from 'crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import { compile } from './compile'
import { BASE_RELATIONS, emitFacts } from './emit'
import { exampleId, exampleSource } from './examples'
import { maxLevel, programFor, programText } from './levels'
import { CACHE_DIR, OUT_DIR } from './paths'
import type { Program } from './program'
import { readTsv, runSouffle, souffleVersion } from './souffle'

export interface RunMeta {
  example: string
  level: number
  solc: string
  souffle: string
  timings: { compileMs: number; souffleMs: number }
  /** Rows per level-0 relation. */
  factCounts: Record<string, number>
  /** Rows per `.output` relation of the program. */
  counts: Record<string, number>
  createdAt: string
}

export interface RunResult {
  meta: RunMeta
  dir: string
  program: Program
}

function hash(text: string): string {
  return createHash('sha256').update(text).digest('hex').slice(0, 16)
}

export function exampleDir(id: string): string {
  return join(OUT_DIR, exampleId(id))
}

export function levelDir(id: string, level: number): string {
  if (!Number.isInteger(level) || level < 0)
    throw new Error(`bad level ${level}`)
  return join(exampleDir(id), `L${level}`)
}

/** Facts for the example, reusing the previous compile when the source has not changed. */
async function ensureFacts(
  id: string,
): Promise<{
  dir: string
  solc: string
  compileMs: number
  counts: Record<string, number>
}> {
  const source = exampleSource(id)
  const dir = join(exampleDir(id), 'facts')
  const stamp = join(dir, 'source.sha')
  const metaPath = join(dir, 'facts.json')
  if (
    existsSync(stamp) &&
    readFileSync(stamp, 'utf8') === hash(source) &&
    existsSync(metaPath)
  ) {
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as {
      solc: string
      counts: Record<string, number>
    }
    return { dir, solc: meta.solc, compileMs: 0, counts: meta.counts }
  }
  const compiled = await compile({
    fileName: `${id}.sol`,
    source,
    cacheDir: CACHE_DIR,
  })
  const emitted = emitFacts({
    unit: id,
    fileName: `${id}.sol`,
    source,
    output: compiled.output,
    solcVersion: compiled.solcVersion,
  })
  rmSync(dir, { recursive: true, force: true })
  emitted.facts.write(dir)
  writeFileSync(join(dir, 'source.sol'), source)
  writeFileSync(
    join(dir, 'ast.json'),
    JSON.stringify(
      compiled.output.sources?.[`${id}.sol`]?.ast ?? null,
      null,
      2,
    ),
  )
  const counts: Record<string, number> = {}
  for (const name of Object.keys(BASE_RELATIONS))
    counts[name] = emitted.facts.count(name)
  writeFileSync(
    metaPath,
    JSON.stringify({ solc: compiled.solcVersion, counts }, null, 2),
  )
  writeFileSync(stamp, hash(source))
  return {
    dir,
    solc: compiled.solcVersion,
    compileMs: compiled.timings.compileMs,
    counts,
  }
}

export async function runExample(
  id: string,
  level = maxLevel(),
): Promise<RunResult> {
  const facts = await ensureFacts(id)
  const dir = levelDir(id, level)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(join(dir, 'derived'), { recursive: true })
  const programPath = join(dir, 'program.dl')
  writeFileSync(programPath, programText(level))
  const program = programFor(level)
  const souffle = runSouffle({
    program: programPath,
    facts: facts.dir,
    out: join(dir, 'derived'),
  })
  const counts: Record<string, number> = {}
  for (const rel of program.relations.filter((r) => r.isOutput))
    counts[rel.name] = readTsv(join(dir, 'derived', `${rel.name}.csv`)).length
  const meta: RunMeta = {
    example: id,
    level,
    solc: facts.solc,
    souffle: souffleVersion(),
    timings: { compileMs: facts.compileMs, souffleMs: souffle.ms },
    factCounts: facts.counts,
    counts,
    createdAt: new Date().toISOString(),
  }
  writeFileSync(join(dir, 'run.json'), JSON.stringify(meta, null, 2))
  return { meta, dir, program }
}

/** The rows of a relation in a finished run: a `.facts` file at level 0, a derived `.csv` above. */
export function rowsOf(
  id: string,
  level: number,
  relation: string,
): string[][] {
  if (!/^\w+$/.test(relation)) throw new Error(`bad relation ${relation}`)
  const factsPath = join(exampleDir(id), 'facts', `${relation}.facts`)
  if (relation in BASE_RELATIONS) return readTsv(factsPath)
  return readTsv(join(levelDir(id, level), 'derived', `${relation}.csv`))
}

export function readRunMeta(id: string, level: number): RunMeta | undefined {
  const path = join(levelDir(id, level), 'run.json')
  return existsSync(path)
    ? (JSON.parse(readFileSync(path, 'utf8')) as RunMeta)
    : undefined
}

/** Levels that have been run for an example. */
export function runLevels(id: string): number[] {
  const dir = exampleDir(id)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .map((d) => /^L(\d+)$/.exec(d)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number)
    .filter((n) => existsSync(join(dir, `L${n}`, 'run.json')))
    .sort((a, b) => a - b)
}
