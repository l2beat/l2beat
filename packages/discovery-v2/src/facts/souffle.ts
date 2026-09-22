/**
 * Runs the Datalog program with the `souffle` interpreter.
 *
 * Relations go in as Soufflé's native tab-separated `.facts` files and come
 * back as tab-separated `.csv`, one file per `.output` relation; the whole
 * exchange lives in a scratch directory that is removed afterwards. The
 * interpreter is used rather than the compiler because the program is small
 * and changes with the rules, and a run over a real contract takes well
 * under a second either way.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { runProcess } from '../author/process'
import type { AstRelations } from './astFacts'

export type Row = (number | string)[]
export type Relations = Record<string, Row[]>

export const DEFAULT_SOUFFLE_TIMEOUT_MS = 60_000

export interface SouffleOptions {
  binary?: string
  timeoutMs?: number
}

export class SouffleError extends Error {
  constructor(
    message: string,
    readonly stderr: string,
  ) {
    super(message)
    this.name = 'SouffleError'
  }
}

export function souffleAvailable(binary = 'souffle'): boolean {
  const dirs = (process.env.PATH ?? '').split(path.delimiter)
  return dirs.some((dir) => dir !== '' && fs.existsSync(path.join(dir, binary)))
}

export async function runSouffle(
  program: string,
  inputs: AstRelations & { mainContract: [number][] },
  outputs: readonly string[],
  options: SouffleOptions = {},
): Promise<Relations> {
  const workDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'discovery-v2-souffle-'),
  )
  try {
    const factsDir = path.join(workDir, 'facts')
    const outDir = path.join(workDir, 'out')
    fs.mkdirSync(factsDir)
    fs.mkdirSync(outDir)
    for (const [name, rows] of Object.entries(inputs)) {
      fs.writeFileSync(path.join(factsDir, `${name}.facts`), factsText(rows))
    }
    const run = await runProcess(
      options.binary ?? 'souffle',
      ['--fact-dir', factsDir, '--output-dir', outDir, program],
      '',
      workDir,
      process.env,
      options.timeoutMs ?? DEFAULT_SOUFFLE_TIMEOUT_MS,
    )
    if (run.timedOut) {
      throw new SouffleError(
        `souffle did not finish within ${run.timeoutMs} ms`,
        run.stderr,
      )
    }
    if (run.exitCode !== 0) {
      throw new SouffleError(
        `souffle exited with code ${run.exitCode}`,
        run.stderr,
      )
    }
    return Object.fromEntries(
      outputs.map((name) => [name, readCsv(path.join(outDir, `${name}.csv`))]),
    )
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true })
  }
}

/** Tabs and newlines inside a symbol would split the row, so they are escaped as Soufflé expects. */
function factsText(rows: Row[]): string {
  return rows
    .map((row) =>
      row
        .map((cell) =>
          typeof cell === 'number'
            ? String(cell)
            : cell
                .replace(/\\/g, '\\\\')
                .replace(/\t/g, '\\t')
                .replace(/\n/g, '\\n'),
        )
        .join('\t'),
    )
    .join('\n')
    .concat(rows.length === 0 ? '' : '\n')
}

function readCsv(file: string): Row[] {
  if (!fs.existsSync(file)) {
    return []
  }
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .filter((line) => line !== '')
    .map((line) =>
      line
        .split('\t')
        .map((cell) => (/^-?\d+$/.test(cell) ? Number(cell) : cell)),
    )
}
