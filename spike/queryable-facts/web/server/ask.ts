// Step 7: ask an AI about one run. Drives the `codex` CLI non-interactively (`codex exec --json`)
// with the run folder as its working directory and as the limit of its sandbox, and streams what
// happens back to the browser as NDJSON: the commands the agent runs, its messages, the answer.
// Every question leaves a transcript in <run>/ask/, so the run folder stays the complete record.

import { spawn, spawnSync } from 'child_process'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'fs'
import type { ServerResponse } from 'http'
import { homedir } from 'os'
import { join } from 'path'
import { installQf } from '../../src/pipeline'
import type {
  AskConfig,
  AskEvent,
  AskRequest,
  ModelChoice,
} from '../shared/types'
import { ROOT, timestamp } from './run'

const CODEX = process.env.CODEX ?? 'codex'
const DEFAULT_MODEL = process.env.CODEX_MODEL ?? 'gpt-5.6-sol'
const DEFAULT_EFFORT = process.env.CODEX_EFFORT ?? 'high'
const TIMEOUT_MS = Number(process.env.CODEX_TIMEOUT_MS ?? 20 * 60_000)
const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultra']
const TRANSCRIPT_DIR = 'ask'
/** Command output kept per command in the stream and in the transcript. */
const OUTPUT_LIMIT = 6000

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

function codexHome(): string {
  return process.env.CODEX_HOME ?? join(homedir(), '.codex')
}

/** The models codex itself lists, from the cache it keeps next to its config; a fixed list otherwise. */
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
    // no cache (codex never ran here, or another CODEX_HOME): use the fixed list
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
  return {
    model: DEFAULT_MODEL,
    effort: DEFAULT_EFFORT,
    models,
    codex,
    transcriptDir: TRANSCRIPT_DIR,
  }
}

const QF_SCRIPT = join(ROOT, 'src', 'qf.mjs')
/** Runs made before the qf commands existed get them on first use; newer scripts replace older copies. */
function ensureQf(runDir: string): void {
  const target = join(runDir, 'qf.mjs')
  const fresh =
    existsSync(target) &&
    existsSync(join(runDir, 'qf')) &&
    statSync(target).mtimeMs >= statSync(QF_SCRIPT).mtimeMs
  if (!fresh) installQf(runDir, QF_SCRIPT)
}

/** What the agent is told before the first question of a conversation. */
function briefing(unit: string): string {
  return `You are answering a researcher's question about one Solidity contract, from inside one run of a static-analysis pipeline: your working directory. source.sol is the flattened source exactly as compiled (unit name \`${unit}\`); line numbers refer to it. Everything the pipeline knows is reachable through the ./qf commands, which print rows as Datalog atoms you can quote.

## Commands (use these; do not read program.dl or derived/*.csv directly)
- ./qf writers [<variable>]        who may write a storage variable, how, and where
- ./qf function <name>             one function: signature, modifiers, callers, callees, writes, findings
- ./qf guards <entry point>        sender-check findings for each variable it may write, the checks behind them, unknown effects on the way
- ./qf gaps [<entry point>]        effects the analysis could not follow (delegatecall, unresolved sstore, function pointers)
- ./qf source <function>|<a>-<b>   numbered source lines
- ./qf rows <relation> [<text>]    rows of any derived relation containing <text> (./qf help lists the answer relations)
- ./qf explain '<atom>'            why a tuple holds, down to the AST facts
- ./qf query <file.dl>             only when no relation states what you need: write rules to scratch/extra.dl (with .decl and .output), run this, and quote the rules in the answer
Names: a function by \`Contract.name(types)\`, \`Contract.name\` or \`name\`; a variable by \`Contract.name\` or \`name\`.

## Reading findings
The Tier column says what kind of statement a finding is: structural (read off the syntax tree) · may (over-approximation; every "writer" is this) · guaranteed (holds on every completing execution, under the model: structured control flow, internal calls resolved, no unknown effect on the path) · heuristic (path coverage from straight-line position; "no check" relative to what the rules recognise as a check) · unknown (an effect the rules cannot follow). Findings quote the condition as written: "compares with owner" says what the sender is compared against, not that the comparison grants access (a \`!=\` is visible). An unknown effect (variable \`*\`) caps every universal statement about that entry point.

## How to work
1. Start with ./qf guards or ./qf writers for the functions or variables in the question, then ./qf source for the lines they point at. Two or three commands usually suffice.
2. Repeat guaranteed and structural findings as facts and cite them; treat heuristic findings as leads to verify in the source; never make a universal claim across an unknown effect.
3. Write Datalog only if the question needs a relation that does not exist.
4. Be concise: a researcher should be able to verify the answer in a minute.

## Answer format (Markdown)
- One or two sentences of verdict first.
- Then **Evidence**: bullets, each citing a source line (\`L26\`, \`L24-L27\`) and/or an atom copied verbatim from qf output in backticks, e.g. \`findings("...", "...", "...", "caller-selectable", "...", "structural", 26)\`.
- Then, if relevant, **What the rules do not capture**: what you concluded from the code that no finding states, and the rule that would state it.
- No preamble, no restating the question, no closing summary.`
}

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

/** `/bin/bash -lc 'grep foo bar'` → `grep foo bar`, for display. */
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

function validate(req: AskRequest): string {
  const question = (req.question ?? '').trim()
  if (question === '') throw new Error('empty question')
  if (question.length > 8000) throw new Error('question too long')
  if (!/^[\w.-]+$/.test(req.model ?? '')) throw new Error('bad model name')
  if (!EFFORTS.includes(req.effort)) throw new Error(`bad effort ${req.effort}`)
  if (req.threadId !== undefined && !/^[\w-]+$/.test(req.threadId))
    throw new Error('bad thread id')
  return question
}

/**
 * Runs one question through codex and streams AskEvents to `res` (one JSON object per line).
 * Resolves when the stream is closed. Validation errors are thrown before anything is written.
 */
export function streamAsk(
  req: AskRequest,
  runDir: string,
  res: ServerResponse,
): Promise<void> {
  const question = validate(req)
  const unit =
    (
      JSON.parse(readFileSync(join(runDir, 'run.json'), 'utf8')) as {
        unit?: string
      }
    ).unit ?? 'source.sol'
  ensureQf(runDir)
  const common = [
    '--json',
    '-m',
    req.model,
    '-c',
    `model_reasoning_effort="${req.effort}"`,
    '-c',
    'approval_policy="never"',
    // the agent may only write inside the run folder (and /tmp); no network
    '-c',
    'sandbox_mode="workspace-write"',
  ]
  const args = req.threadId
    ? ['exec', 'resume', req.threadId, ...common, '-']
    : ['exec', ...common, '--skip-git-repo-check', '--color', 'never', '-']
  const prompt = req.threadId
    ? `## Follow-up question\n\n${question}`
    : `${briefing(unit)}\n\n## Question\n\n${question}`
  const shownCommand = `${CODEX} ${args
    .map((a) => (/[\s"]/.test(a) ? `'${a}'` : a))
    .join(' ')}  (cwd: ${runDir})`

  return new Promise((resolve) => {
    const started = Date.now()
    const events: AskEvent[] = []
    const stderr: string[] = []
    let finished = false
    let usage: Record<string, number> | undefined
    let threadId = req.threadId

    res.writeHead(200, {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-cache',
      'x-accel-buffering': 'no',
    })
    const send = (event: AskEvent) => {
      events.push(event)
      if (!res.writableEnded) res.write(`${JSON.stringify(event)}\n`)
    }

    const child = spawn(CODEX, args, {
      cwd: runDir,
      env: { ...process.env, NO_COLOR: '1' },
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const timer = setTimeout(() => {
      send({ type: 'error', message: `timed out after ${TIMEOUT_MS / 1000} s` })
      child.kill('SIGTERM')
    }, TIMEOUT_MS)
    res.on('close', () => {
      if (!finished) child.kill('SIGTERM')
    })

    const onRaw = (raw: RawEvent) => {
      const item = raw.item
      switch (raw.type) {
        case 'thread.started':
          threadId = raw.thread_id ?? threadId
          send({
            type: 'started',
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
              text: `files: ${(item.changes ?? [])
                .map((c) => `${c.kind ?? 'changed'} ${c.path ?? '?'}`)
                .join(', ')}`,
            })
          return
        case 'web_search':
          if (completed)
            send({ type: 'note', text: `web search: ${item.query ?? ''}` })
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
      const answer = [...events].reverse().find((e) => e.type === 'message')
      const hadError = events.some((e) => e.type === 'error')
      if (code !== 0 && !hadError) {
        const tail = stderr.join('').trim().split('\n').slice(-8).join('\n')
        send({
          type: 'error',
          message: `${CODEX} exited with ${code ?? 'a signal'}${tail ? `:\n${tail}` : ''}`,
        })
      }
      let transcript: string | undefined
      try {
        transcript = writeTranscript(runDir, {
          question,
          model: req.model,
          effort: req.effort,
          threadId,
          command: shownCommand,
          events,
          answer: answer?.type === 'message' ? answer.text : undefined,
          exitCode: code,
          ms: Date.now() - started,
          usage,
        })
      } catch (error) {
        send({
          type: 'note',
          text: `could not write the transcript: ${error instanceof Error ? error.message : String(error)}`,
        })
      }
      send({
        type: 'done',
        ms: Date.now() - started,
        exitCode: code,
        usage,
        transcript,
      })
      res.end()
      resolve()
    })

    child.stdin.on('error', () => {
      // codex went away before reading the prompt; `close` reports it
    })
    child.stdin.end(prompt)
  })
}

function writeTranscript(
  runDir: string,
  t: {
    question: string
    model: string
    effort: string
    threadId?: string
    command: string
    events: AskEvent[]
    answer?: string
    exitCode: number | null
    ms: number
    usage?: Record<string, number>
  },
): string {
  const dir = join(runDir, TRANSCRIPT_DIR)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  const n = readdirSync(dir).filter((f) => f.endsWith('.md')).length + 1
  const name = `${String(n).padStart(2, '0')}-${timestamp()}.md`
  const lines: string[] = [
    `# Question ${n}`,
    '',
    `- model: ${t.model} (reasoning effort ${t.effort})`,
    `- thread: ${t.threadId ?? '?'}`,
    `- command: \`${t.command}\``,
    `- took: ${(t.ms / 1000).toFixed(1)} s, exit code ${t.exitCode ?? 'none'}`,
    ...(t.usage
      ? [
          `- tokens: ${Object.entries(t.usage)
            .map(([k, v]) => `${k}=${v}`)
            .join(', ')}`,
        ]
      : []),
    '',
    '## Question',
    '',
    t.question,
    '',
    '## What the agent did',
    '',
  ]
  for (const e of t.events) {
    if (e.type === 'command' && e.status !== 'running') {
      lines.push(
        '```',
        `$ ${e.command}`,
        `→ ${e.status}${e.exitCode !== undefined ? `, exit ${e.exitCode}` : ''}`,
        ...(e.output ? [clip(e.output, 2000)] : []),
        '```',
        '',
      )
    } else if (e.type === 'reasoning') {
      lines.push(`_${e.text.replace(/\s+/g, ' ')}_`, '')
    } else if (e.type === 'note' || e.type === 'error') {
      lines.push(`> ${e.type}: ${'text' in e ? e.text : e.message}`, '')
    }
  }
  lines.push('## Answer', '', t.answer ?? '_(no answer)_', '')
  writeFileSync(join(dir, name), lines.join('\n'))
  return `${TRANSCRIPT_DIR}/${name}`
}
