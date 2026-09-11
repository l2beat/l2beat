// Running Soufflé, reading what it wrote, and asking it why a tuple holds (provenance mode).

import { spawnSync } from 'child_process'
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { join } from 'path'
import type { Column } from './program'

export const SOUFFLE = process.env.SOUFFLE ?? 'souffle'

export class SouffleError extends Error {
  constructor(
    message: string,
    readonly stdout: string,
    readonly stderr: string,
  ) {
    super(message)
  }
}

export function souffleVersion(bin = SOUFFLE): string {
  const run = spawnSync(bin, ['--version'], { encoding: 'utf8' })
  const m = /Version:\s*([^\s(]+)/.exec(run.stdout ?? '')
  return m?.[1] ?? (run.error ? `not found (${run.error.message})` : 'unknown')
}

export function readTsv(path: string): string[][] {
  if (!existsSync(path)) return []
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => line.split('\t'))
}

export interface SouffleRun {
  ms: number
  command: string
  stderr: string
}

/** `souffle --no-preprocessor -F <facts> -D <out> <program>`; throws SouffleError with its messages. */
export function runSouffle(opts: {
  program: string
  facts: string
  out: string
  souffle?: string
  jobs?: number
}): SouffleRun {
  const bin = opts.souffle ?? SOUFFLE
  const args = [
    '--no-preprocessor',
    `-j${opts.jobs ?? 1}`,
    '-F',
    opts.facts,
    '-D',
    opts.out,
    opts.program,
  ]
  const t0 = performance.now()
  const run = spawnToFiles(bin, args, opts.out)
  const ms = performance.now() - t0
  if (run.error)
    throw new SouffleError(
      `could not run '${bin}': ${run.error.message} (set $SOUFFLE)`,
      '',
      '',
    )
  if (run.status !== 0)
    throw new SouffleError(
      `souffle exited with ${run.status}`,
      run.stdout,
      run.stderr,
    )
  return { ms, command: [bin, ...args].join(' '), stderr: run.stderr.trim() }
}

/**
 * Runs a command with stdin/stdout/stderr bound to files instead of pipes. Node's pipes are Unix
 * socket pairs, which a sandbox (codex's) forbids; files are always allowed. The outputs are kept in
 * `dir` (souffle.stdout, souffle.stderr) next to what Soufflé wrote.
 */
function spawnToFiles(
  bin: string,
  args: string[],
  dir: string,
  input?: string,
): { status: number | null; stdout: string; stderr: string; error?: Error } {
  mkdirSync(dir, { recursive: true })
  const outPath = join(dir, 'souffle.stdout')
  const errPath = join(dir, 'souffle.stderr')
  const inPath = join(dir, 'souffle.stdin')
  writeFileSync(inPath, input ?? '')
  const fdIn = openSync(inPath, 'r')
  const fdOut = openSync(outPath, 'w')
  const fdErr = openSync(errPath, 'w')
  try {
    const run = spawnSync(bin, args, { stdio: [fdIn, fdOut, fdErr] })
    return {
      status: run.status,
      error: run.error,
      stdout: readFileSync(outPath, 'utf8'),
      stderr: readFileSync(errPath, 'utf8'),
    }
  } finally {
    closeSync(fdIn)
    closeSync(fdOut)
    closeSync(fdErr)
  }
}

// ---------- provenance ----------

export type ProofKind =
  | 'derived'
  | 'fact'
  | 'negation'
  | 'constraint'
  | 'missing'

export interface ProofNode {
  kind: ProofKind
  /** The atom as Soufflé prints it, e.g. `writes("a", "b")` or `412 != 410`. */
  text: string
  /** Soufflé's rule number within the head relation, e.g. "R2" (derived nodes only). */
  ruleNumber?: string
  /** The rule as Soufflé sees it after its own rewriting. */
  rule?: string
  children: ProofNode[]
  /** Set by the stitcher: which program (stage) this node was explained in. */
  stage?: string
}

/** Soufflé prints functor constraints (`contains("a", "b")`) like atoms; these are not relations. */
export const FUNCTORS = new Set([
  'contains',
  'match',
  'cat',
  'strlen',
  'substr',
  'ord',
  'to_string',
  'to_number',
  'as',
  'range',
])

interface RawProof {
  premises?: string
  axiom?: string
  'rule-number'?: string
  children?: RawProof[]
}

interface RawRule {
  'rule-number': string
  rule: string
}

/** Formats a tuple the way Soufflé's explain shell expects it. */
export function formatAtom(
  relation: string,
  cols: string[],
  columns: Column[],
): string {
  const args = cols.map((value, i) =>
    columns[i]?.type === 'number' || columns[i]?.type === 'unsigned'
      ? value
      : JSON.stringify(value),
  )
  return `${relation}(${args.join(', ')})`
}

/** Splits `rel("a", "b", 3)` into relation and argument texts (strings unquoted). */
export function splitAtom(
  text: string,
): { relation: string; cols: string[] } | undefined {
  const m = /^\s*!?(\w+)\s*\(([\s\S]*)\)\s*$/.exec(text)
  if (!m) return undefined
  const body = m[2] ?? ''
  const cols: string[] = []
  let i = 0
  const skip = () => {
    while (i < body.length && /\s/.test(body[i] ?? '')) i++
  }
  skip()
  if (i >= body.length) return { relation: m[1] ?? '', cols }
  for (;;) {
    skip()
    if (body[i] === '"') {
      let value = ''
      i++
      while (i < body.length && body[i] !== '"') {
        if (body[i] === '\\' && i + 1 < body.length) i++
        value += body[i]
        i++
      }
      if (body[i] !== '"') return undefined
      i++
      cols.push(value)
    } else {
      let j = i
      while (j < body.length && body[j] !== ',') j++
      cols.push(body.slice(i, j).trim())
      i = j
    }
    skip()
    if (i >= body.length) return { relation: m[1] ?? '', cols }
    if (body[i] !== ',') return undefined
    i++
  }
}

/**
 * Soufflé's explain mode prints JSON with escapes JSON does not have (`\;` for a semicolon in a
 * string): keep the valid escapes, drop the backslash from the others.
 */
function fixSouffleJson(text: string): string {
  let out = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c !== '\\') {
      out += c
      continue
    }
    const next = text[i + 1] ?? ''
    if ('"\\/bfnrtu'.includes(next)) out += c + next
    else out += next
    i++
  }
  return out
}

function firstJsonObject(text: string): string | undefined {
  const start = text.indexOf('{')
  if (start < 0) return undefined
  let depth = 0
  let inString = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (c === '\\') i++
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) return text.slice(start, i + 1)
    }
  }
  return undefined
}

function cleanRule(rule: string): string {
  return rule
    .replace(/\+underscore_\d+/g, '_')
    .replace(/@generator_(\d+)/g, '_gen$1')
    .replace(/\n\s+/g, '\n    ')
}

function convert(raw: RawProof, rules: RawRule[]): ProofNode {
  if (raw.premises !== undefined) {
    const relation = /^(\w+)\(/.exec(raw.premises)?.[1] ?? ''
    const number = raw['rule-number']?.replace(/[()]/g, '') ?? ''
    const rule = rules.find(
      (r) =>
        r['rule-number'].replace(/[()]/g, '') === number &&
        r.rule.startsWith(`${relation}(`),
    )
    return {
      kind: 'derived',
      text: raw.premises,
      ruleNumber: number,
      rule: rule ? cleanRule(rule.rule) : undefined,
      children: (raw.children ?? []).map((c) => convert(c, rules)),
    }
  }
  const axiom = raw.axiom ?? ''
  if (axiom === 'Tuple not found')
    return { kind: 'missing', text: axiom, children: [] }
  if (axiom.startsWith('!'))
    return { kind: 'negation', text: axiom, children: [] }
  const name = /^(\w+)\(/.exec(axiom)?.[1]
  if (name && !FUNCTORS.has(name))
    return { kind: 'fact', text: axiom, children: [] }
  return { kind: 'constraint', text: axiom, children: [] }
}

/**
 * A copy of the program with a single `.output`: the relation being explained. In provenance mode
 * Soufflé writes every output relation with its annotations, which costs seconds for 300 relations;
 * with no output it computes nothing. One output keeps exactly what the question needs.
 */
function explainProgram(programPath: string, relation: string): string {
  if (!/^\w+$/.test(relation)) throw new Error(`bad relation name ${relation}`)
  const path = programPath.replace(/\.dl$/, `.explain.${relation}.dl`)
  if (!existsSync(path)) {
    const text = readFileSync(programPath, 'utf8')
      .split('\n')
      .filter((line) => !/^\.output\b/.test(line))
      .join('\n')
    writeFileSync(path, `${text}\n.output ${relation}\n`)
  }
  return path
}

/** Asks Soufflé for the proof tree of one atom of the program at `programPath` over `factsDir`. */
export function explainAtom(opts: {
  programPath: string
  factsDir: string
  atom: string
  souffle?: string
  depth?: number
}): { proof: ProofNode; ms: number } {
  const bin = opts.souffle ?? SOUFFLE
  const t0 = performance.now()
  const relation = /^(\w+)\(/.exec(opts.atom.trim())?.[1] ?? ''
  const outDir = join(opts.programPath, '..', 'explain-out')
  mkdirSync(outDir, { recursive: true })
  const run = spawnToFiles(
    bin,
    [
      '--no-preprocessor',
      '-t',
      'explain',
      '-F',
      opts.factsDir,
      '-D',
      outDir,
      explainProgram(opts.programPath, relation),
    ],
    outDir,
    `setdepth ${opts.depth ?? 60}\nformat json\nexplain ${opts.atom}\nexit\n`,
  )
  if (run.error) throw new Error(`could not run ${bin}: ${run.error.message}`)
  if (run.status !== 0)
    throw new Error(
      `souffle -t explain exited with ${run.status}: ${run.stderr}`,
    )
  const json = firstJsonObject(run.stdout)
  if (!json)
    throw new Error(`no proof in Soufflé output:\n${run.stdout.slice(0, 2000)}`)
  const parsed = JSON.parse(fixSouffleJson(json)) as {
    proof: RawProof
    rules?: RawRule[]
  }
  return {
    proof: convert(parsed.proof, parsed.rules ?? []),
    ms: performance.now() - t0,
  }
}
