// Asking: one question → one folder under <run>/asks/<n>/ holding everything that happened: the
// question, the briefing, every command the agent ran, the queries it wrote (with their programs and
// results), its answer, and the check of every atom the answer cites against the run's tuples.
//
// The agent is the `codex` CLI run non-interactively (`codex exec --json`) with the run folder as
// working directory and sandbox. Its only tools are the shell and ./q.

import { spawn, spawnSync } from 'child_process'
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { homedir } from 'os'
import { join, relative, resolve } from 'path'
import {
  installQ,
  loadRun,
  type RunMeta,
  readRelation,
  runLibrary,
} from './pipeline'
import { type Home, locate } from './proof'
import { listQueries, type QueryResult } from './query'
import { catalog, type Library } from './rules'
import { splitAtom } from './souffle'

export const CODEX = process.env.CODEX ?? 'codex'
export const DEFAULT_MODEL = process.env.CODEX_MODEL ?? 'gpt-5.6-sol'
export const DEFAULT_EFFORT = process.env.CODEX_EFFORT ?? 'high'
const TIMEOUT_MS = Number(process.env.CODEX_TIMEOUT_MS ?? 20 * 60_000)
export const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultra']
const OUTPUT_LIMIT = 8000

export interface ModelChoice {
  slug: string
  label: string
  efforts: string[]
}

export interface AskConfig {
  model: string
  effort: string
  models: ModelChoice[]
  codex: { command: string; version?: string; error?: string }
}

export interface AskRequest {
  question: string
  model: string
  effort: string
  /** Codex thread to continue for a follow-up question. */
  threadId?: string
}

export interface Claim {
  /** The backticked text as written. */
  text: string
  relation: string
  cols: string[]
  status: 'verified' | 'missing' | 'unknown-relation'
  home?: Home
}

export type AskEvent =
  | { type: 'started'; ask: string; threadId: string; command: string }
  | { type: 'reasoning'; text: string }
  | {
      type: 'command'
      id: string
      command: string
      status: 'running' | 'completed' | 'failed'
      exitCode?: number
      output?: string
    }
  | { type: 'note'; text: string }
  | { type: 'query'; result: QueryResult }
  /** An agent message; the last one before `done` is the answer. */
  | { type: 'message'; text: string }
  | {
      type: 'done'
      ask: string
      ms: number
      exitCode: number | null
      usage?: Record<string, number>
      answer?: string
      claims: Claim[]
    }
  | { type: 'error'; message: string }

export interface AskRecord {
  ask: string
  n: number
  question: string
  model: string
  effort: string
  threadId?: string
  command: string
  createdAt: string
  ms: number
  exitCode: number | null
  usage?: Record<string, number>
  answer?: string
  claims: Claim[]
  queries: QueryResult[]
}

function codexHome(): string {
  return process.env.CODEX_HOME ?? join(homedir(), '.codex')
}

const FALLBACK_MODELS: ModelChoice[] = [
  {
    slug: 'gpt-5.6-sol',
    label: 'GPT-5.6-Sol',
    efforts: ['low', 'medium', 'high', 'xhigh', 'max'],
  },
  {
    slug: 'gpt-5.5',
    label: 'GPT-5.5',
    efforts: ['low', 'medium', 'high', 'xhigh'],
  },
  {
    slug: 'gpt-5.4-mini',
    label: 'GPT-5.4-Mini',
    efforts: ['low', 'medium', 'high', 'xhigh'],
  },
]

function listModels(): ModelChoice[] {
  try {
    const cache = JSON.parse(
      readFileSync(join(codexHome(), 'models_cache.json'), 'utf8'),
    ) as {
      models?: Array<{
        slug?: string
        display_name?: string
        visibility?: string
        supported_reasoning_levels?: Array<{ effort?: string }>
      }>
    }
    const models = (cache.models ?? [])
      .filter((m) => m.slug && m.visibility !== 'hide')
      .map((m) => ({
        slug: m.slug ?? '',
        label: m.display_name ?? m.slug ?? '',
        efforts: (m.supported_reasoning_levels ?? [])
          .map((l) => l.effort ?? '')
          .filter((e) => e !== ''),
      }))
    if (models.length > 0) return models
  } catch {
    // no cache: fixed list
  }
  return FALLBACK_MODELS
}

export function askConfig(): AskConfig {
  const models = listModels()
  if (!models.some((m) => m.slug === DEFAULT_MODEL))
    models.unshift({
      slug: DEFAULT_MODEL,
      label: DEFAULT_MODEL,
      efforts: EFFORTS,
    })
  const version = spawnSync(CODEX, ['--version'], {
    encoding: 'utf8',
    timeout: 10_000,
  })
  const codex = version.error
    ? { command: CODEX, error: `cannot run ${CODEX}: ${version.error.message}` }
    : version.status === 0
      ? { command: CODEX, version: version.stdout.trim() }
      : {
          command: CODEX,
          error:
            (version.stderr || version.stdout).trim() ||
            `${CODEX} --version exited with ${version.status}`,
        }
  return { model: DEFAULT_MODEL, effort: DEFAULT_EFFORT, models, codex }
}

// ---------- the briefing ----------

/** What the run is about, in a few lines: deployed contracts (project runs) or the contracts of the file. */
function summary(runDir: string, meta: RunMeta): string {
  const lines: string[] = []
  if (meta.input.kind === 'project') {
    const entries = readRelation(runDir, 'dEntry')
    const units = readRelation(runDir, 'dUnit')
    const contracts = entries.filter((e) => e[1] === 'Contract')
    const eoas = entries.filter((e) => e[1] === 'EOA').length
    lines.push(
      `Project ${meta.name}: ${contracts.length} deployed contracts and ${eoas} EOAs in discovery's snapshot; ${meta.units.filter((u) => u.status === 'ok').length} source files compiled.`,
      '',
      'Deployed contracts (name · address · proxy type · source units):',
    )
    for (const e of contracts.sort((a, b) =>
      (a[2] ?? '').localeCompare(b[2] ?? ''),
    )) {
      const us = units.filter((u) => u[0] === e[0]).map((u) => u[2])
      lines.push(
        `- ${e[2] || '(unnamed)'} · ${e[0]} · ${e[3] || 'immutable'} · ${us.join(', ') || 'no source'}`,
      )
    }
    if (meta.missing.length > 0)
      lines.push(
        `- ${meta.missing.length} contract(s) have no flattened source: ${meta.missing.map((m) => m.entryName).join(', ')}`,
      )
  } else {
    const contracts = readRelation(runDir, 'contract')
    const entries = readRelation(runDir, 'entryPoint')
    lines.push(
      `One source file, ${meta.input.name}: ${contracts.length} contracts/interfaces/libraries, ${entries.length} entry points. No discovery snapshot: the project relations (layers 7-9) are empty; work with the unit relations.`,
    )
    for (const c of contracts) lines.push(`- ${c[2]} ${c[0]}`)
  }
  return lines.join('\n')
}

export function briefing(runDir: string, meta: RunMeta, lib: Library): string {
  return `You answer a researcher's question from inside one run of a static-analysis pipeline: your working directory. The pipeline compiled every source file, wrote solc's syntax tree and storage layout down as facts, ran a library of Datalog (Soufflé) rules over them and over discovery's snapshot of the deployed contracts' values, and wrote every derived relation to disk. Every tuple has a proof down to those facts.

Your only way to make a claim is a tuple. Read the catalogue, write Datalog rules that compute exactly what the question asks, run them, and cite the tuples they derive. The source code is there to understand what a rule should say, never to answer from.

## Tools (run them in this folder; each prints Datalog atoms you can quote)
- ./q catalog [--all]                       this catalogue (--all adds the unit-internal relations)
- ./q show <relation>                       declaration, meaning, the rules that define it, count, sample rows
- ./q rows <relation> [text...] [--limit N] rows containing every text (case-insensitive), as atoms — for finding names and shapes
- ./q run <file.dl> [--name n]              run your rules against the run: prints the tuples of every relation the file declares, or Soufflé's error
- ./q why '<atom>'                          why a tuple holds: its proof tree, down to solc facts and discovery values; leaves derived in another stage tell you how to continue
- ./q source <id> | <unit> <a>-<b>          source lines of a function or variable id, or of a unit
- ./q units                                 the source files (units) of this run
Do not read program.dl, derived/*.csv or facts/*.facts directly: ./q rows and ./q show print the same rows with their meaning.

## Work in this order (aim for under ten commands)
1. One or two ./q rows calls to pin the exact spelling of the names in the question (an address, a function id). Do not browse relation after relation: the catalogue below already says what each one means.
2. Write one query file with the relations that answer the question: the actors and paths, and the gaps that bound them (unresolvedCheck, crossCallGap, unknownAt, unmatchedValue filtered to the contracts on the path).
3. ./q run it; fix Soufflé's error if any; adjust until the rows say what you need.
4. ./q why on one to three key tuples to see what they rest on.
5. Answer.

## Writing rules
- A query file: \`.decl name(Col: symbol, ..., N: number)\` then rules \`name(...) :- ... .\`. Every relation you declare is printed. Prefer library relations: a rule that only joins, filters or recurses over them composes reviewed meaning. A rule that reads the tree (node, child, attr, or any [unit-internal] relation) runs per unit and is an interpretation of syntax: say so when you rely on one.
- Ids are names: a contract is \`<unit>:<Contract>\`, a function \`<unit>:<Contract>.<name>(<types>)\`, a variable \`<unit>:<Contract>.<name>\`; deployed addresses are \`eth:0x…\`. Match by \`contains("pause(", H)\` or exact strings; find the exact spelling with ./q rows.
- Recursion is fine (Soufflé computes fixpoints); negation needs bound variables; \`cat\`, \`contains\`, \`substr\`, \`strlen\`, \`match(regex, s)\`, \`count : { ... }\` are available.
- Iterate: run, read Soufflé's error or the rows, adjust. Two or three runs are normal.

## Evidence
- A claim is an atom copied verbatim from ./q output, in backticks. Anything without an atom is an opinion: label it.
- Tiers in \`allowed\`/\`finding\` rows say what a row rests on: checked (a guaranteed sender check + a discovered value) · checked-or · signature / signature-lead (whoever holds a signature by that address) · lead (a check that runs on some paths only) · discovered (a proxy's own functions admit the admin discovery read from the slot) · open (no sender or signature check the rules recognise) · guaranteed / structural / may / heuristic / unknown for unit findings.
- "Nobody else can" is a closed-world statement: make it only relative to the rules, and name the gaps that cap it: unresolvedCheck, crossCallGap, opaqueWrites, unmatchedValue, and unknown effects (delegatecall, unresolved sstore) in the relevant units.
- Every value is discovery's snapshot at one block; Safe signer semantics (acts) rest on discovery's fields, not on the Safe's code.

## Answer format (Markdown)
1. Verdict in one or two sentences.
2. **Evidence**: bullets; each bullet ends with the one atom in backticks that states it (quote the tier when there is one).
3. **Rules written**: the query file names and one line each on what they compute.
4. **Not covered**: the gaps that bound the answer, with their atoms when there are any.
No preamble, no restating the question, no closing summary.

## The run
${summary(runDir, meta)}

## Catalogue: the relations you can use (${lib.exported.length} exported unit relations, the project relations, the facts)
${catalog(lib)}`
}

// ---------- asking ----------

interface RawItem {
  id?: string
  type?: string
  text?: string
  command?: string
  aggregated_output?: string
  exit_code?: number | null
  status?: string
  message?: string
  query?: string
  changes?: Array<{ path?: string; kind?: string }>
}

interface RawEvent {
  type?: string
  thread_id?: string
  item?: RawItem
  usage?: Record<string, number>
  error?: { message?: string }
  message?: string
}

function prettyCommand(command: string): string {
  const m = /^\/(?:usr\/)?bin\/(?:ba)?sh -l?c (?:'([\s\S]*)'|(\S+))$/.exec(
    command,
  )
  if (!m) return command
  return m[1] !== undefined ? m[1].replace(/'\\''/g, "'") : (m[2] ?? command)
}

function clip(text: string, limit: number): string {
  return text.length > limit
    ? `${text.slice(0, limit)}\n… (${text.length - limit} more characters)`
    : text
}

export function validateAsk(req: AskRequest): string {
  const question = (req.question ?? '').trim()
  if (question === '') throw new Error('empty question')
  if (question.length > 8000) throw new Error('question too long')
  if (!/^[\w.-]+$/.test(req.model ?? '')) throw new Error('bad model name')
  if (!EFFORTS.includes(req.effort)) throw new Error(`bad effort ${req.effort}`)
  if (req.threadId !== undefined && !/^[\w-]+$/.test(req.threadId))
    throw new Error('bad thread id')
  return question
}

export function listAsks(runDir: string): AskRecord[] {
  const dir = join(runDir, 'asks')
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .sort()
    .filter((d) => existsSync(join(dir, d, 'meta.json')))
    .map(
      (d) =>
        JSON.parse(
          readFileSync(join(dir, d, 'meta.json'), 'utf8'),
        ) as AskRecord,
    )
}

function newAskDir(runDir: string): { dir: string; n: number; ask: string } {
  const base = join(runDir, 'asks')
  mkdirSync(base, { recursive: true })
  const n = readdirSync(base).length + 1
  const ask = String(n).padStart(2, '0')
  const dir = join(base, ask)
  mkdirSync(dir, { recursive: true })
  return { dir, n, ask }
}

/** Every backticked span of the answer that is shaped like an atom, checked against the run. */
export function verifyClaims(
  runDir: string,
  askDir: string,
  answer: string,
): Claim[] {
  const lib = runLibrary(runDir)
  const meta = loadRun(runDir)
  const queryDirs = listQueries(askDir).map((q) => q.dir)
  const claims: Claim[] = []
  const seen = new Set<string>()
  for (const m of answer.matchAll(/`([^`\n]+)`/g)) {
    const text = (m[1] ?? '').trim()
    if (seen.has(text)) continue
    const parsed = splitAtom(text)
    if (!parsed || parsed.cols.length === 0) continue
    // variables (capitalised bare words) mean a rule, not a tuple
    if (parsed.cols.some((c) => /^[A-Z_]\w*$/.test(c))) continue
    seen.add(text)
    const inQuery = queryDirs.some((d) => {
      const r = JSON.parse(
        readFileSync(join(d, 'result.json'), 'utf8'),
      ) as QueryResult
      return r.declared.some((x) => x.name === parsed.relation)
    })
    if (!lib.relations.has(parsed.relation) && !inQuery) {
      claims.push({
        text,
        relation: parsed.relation,
        cols: parsed.cols,
        status: 'unknown-relation',
      })
      continue
    }
    const located = locate(runDir, parsed.relation, parsed.cols, {
      queryDirs,
      meta,
      lib,
    })
    claims.push({
      text,
      relation: parsed.relation,
      cols: parsed.cols,
      status: located ? 'verified' : 'missing',
      home: located?.home,
    })
  }
  return claims
}

/**
 * Runs one question through codex, calling `onEvent` for everything that happens, and records the
 * ask under <run>/asks/<n>/. Resolves with the record when codex exits.
 */
export function ask(
  runDirIn: string,
  req: AskRequest,
  onEvent: (event: AskEvent) => void,
  signal?: { aborted: boolean; onAbort: (fn: () => void) => void },
): Promise<AskRecord> {
  const runDir = resolve(runDirIn)
  const question = validateAsk(req)
  const meta = loadRun(runDir)
  const lib = runLibrary(runDir)
  installQ(runDir)
  const { dir: askDir, n, ask: askName } = newAskDir(runDir)
  writeFileSync(join(askDir, 'question.md'), `${question}\n`)
  const first = briefing(runDir, meta, lib)
  writeFileSync(join(askDir, 'briefing.md'), first)
  const prompt = req.threadId
    ? `## Follow-up question\n\n${question}`
    : `${first}\n\n## Question\n\n${question}`
  const common = [
    '--json',
    '-m',
    req.model,
    '-c',
    `model_reasoning_effort="${req.effort}"`,
    '-c',
    'approval_policy="never"',
    '-c',
    'sandbox_mode="workspace-write"',
    // the briefing is the only instruction: do not read the repository's AGENTS.md files
    '-c',
    'project_doc_max_bytes=0',
  ]
  const args = req.threadId
    ? ['exec', 'resume', req.threadId, ...common, '-']
    : ['exec', ...common, '--skip-git-repo-check', '--color', 'never', '-']
  const shownCommand = `${CODEX} ${args.map((a) => (/[\s"]/.test(a) ? `'${a}'` : a)).join(' ')}  (cwd: ${relative(process.cwd(), runDir) || '.'}, Q_ASK=asks/${askName})`
  const eventsPath = join(askDir, 'events.jsonl')

  return new Promise((resolvePromise) => {
    const started = Date.now()
    const events: AskEvent[] = []
    const stderr: string[] = []
    let finished = false
    let usage: Record<string, number> | undefined
    let threadId = req.threadId
    const knownQueries = new Set<string>()

    const send = (event: AskEvent) => {
      events.push(event)
      appendFileSync(eventsPath, `${JSON.stringify(event)}\n`)
      onEvent(event)
    }
    const emitNewQueries = () => {
      for (const q of listQueries(askDir))
        if (!knownQueries.has(q.name)) {
          knownQueries.add(q.name)
          send({ type: 'query', result: q })
        }
    }

    const child = spawn(CODEX, args, {
      cwd: runDir,
      env: { ...process.env, NO_COLOR: '1', Q_ASK: askDir, Q_RUN: runDir },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const timer = setTimeout(() => {
      send({ type: 'error', message: `timed out after ${TIMEOUT_MS / 1000} s` })
      child.kill('SIGTERM')
    }, TIMEOUT_MS)
    signal?.onAbort(() => {
      if (!finished) child.kill('SIGTERM')
    })

    const onRaw = (raw: RawEvent) => {
      const item = raw.item
      switch (raw.type) {
        case 'thread.started':
          threadId = raw.thread_id ?? threadId
          send({
            type: 'started',
            ask: askName,
            threadId: threadId ?? '',
            command: shownCommand,
          })
          return
        case 'turn.completed':
          usage = raw.usage
          return
        case 'turn.failed':
          send({ type: 'error', message: raw.error?.message ?? 'turn failed' })
          return
        case 'error':
          send({
            type: 'error',
            message: raw.message ?? raw.error?.message ?? 'error',
          })
          return
        case 'item.started':
        case 'item.completed':
          break
        default:
          return
      }
      if (!item) return
      const completed = raw.type === 'item.completed'
      switch (item.type) {
        case 'command_execution':
          send({
            type: 'command',
            id: item.id ?? '',
            command: prettyCommand(item.command ?? ''),
            status:
              item.status === 'completed'
                ? 'completed'
                : completed
                  ? 'failed'
                  : 'running',
            exitCode: item.exit_code ?? undefined,
            output: completed
              ? clip(item.aggregated_output ?? '', OUTPUT_LIMIT)
              : undefined,
          })
          if (completed) emitNewQueries()
          return
        case 'agent_message':
          if (completed && item.text) send({ type: 'message', text: item.text })
          return
        case 'reasoning':
          if (completed && item.text)
            send({ type: 'reasoning', text: item.text })
          return
        case 'error':
          send({ type: 'error', message: item.message ?? 'error' })
          return
        case 'file_change':
          if (completed)
            send({
              type: 'note',
              text: `files: ${(item.changes ?? []).map((c) => `${c.kind ?? 'changed'} ${c.path ?? '?'}`).join(', ')}`,
            })
          return
        default:
          return
      }
    }

    let buffer = ''
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      buffer += chunk
      let nl = buffer.indexOf('\n')
      while (nl >= 0) {
        const line = buffer.slice(0, nl).trim()
        buffer = buffer.slice(nl + 1)
        if (line) {
          try {
            onRaw(JSON.parse(line) as RawEvent)
          } catch {
            send({ type: 'note', text: line })
          }
        }
        nl = buffer.indexOf('\n')
      }
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (chunk: string) => stderr.push(chunk))
    child.on('error', (error) => {
      send({ type: 'error', message: `cannot run ${CODEX}: ${error.message}` })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      finished = true
      emitNewQueries()
      const last = [...events].reverse().find((e) => e.type === 'message')
      const answer = last?.type === 'message' ? last.text : undefined
      const hadError = events.some((e) => e.type === 'error')
      if (code !== 0 && !hadError) {
        const tail = stderr.join('').trim().split('\n').slice(-8).join('\n')
        send({
          type: 'error',
          message: `${CODEX} exited with ${code ?? 'a signal'}${tail ? `:\n${tail}` : ''}`,
        })
      }
      let claims: Claim[] = []
      try {
        claims = answer ? verifyClaims(runDir, askDir, answer) : []
      } catch (error) {
        send({
          type: 'note',
          text: `could not check the citations: ${error instanceof Error ? error.message : String(error)}`,
        })
      }
      const record: AskRecord = {
        ask: askName,
        n,
        question,
        model: req.model,
        effort: req.effort,
        threadId,
        command: shownCommand,
        createdAt: new Date(started).toISOString(),
        ms: Date.now() - started,
        exitCode: code,
        usage,
        answer,
        claims,
        queries: listQueries(askDir),
      }
      if (answer) writeFileSync(join(askDir, 'answer.md'), `${answer}\n`)
      writeFileSync(join(askDir, 'meta.json'), JSON.stringify(record, null, 2))
      send({
        type: 'done',
        ask: askName,
        ms: record.ms,
        exitCode: code,
        usage,
        answer,
        claims,
      })
      resolvePromise(record)
    })
    child.stdin.on('error', () => {
      // codex went away before reading the prompt; `close` reports it
    })
    child.stdin.end(prompt)
  })
}
