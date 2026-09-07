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
  writeFileSync,
} from 'fs'
import type { ServerResponse } from 'http'
import { homedir } from 'os'
import { join } from 'path'
import type {
  AskConfig,
  AskEvent,
  AskRequest,
  ModelChoice,
} from '../shared/types'
import { timestamp } from './run'

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

let souffleCache: string | undefined
/** Absolute path of the Soufflé binary, so the agent's sandboxed shell finds the same one we use. */
function souffleBinary(): string {
  if (souffleCache) return souffleCache
  const wanted = process.env.SOUFFLE ?? 'souffle'
  const found = spawnSync(
    'sh',
    ['-c', `command -v ${JSON.stringify(wanted)}`],
    {
      encoding: 'utf8',
    },
  )
  souffleCache =
    found.status === 0 && found.stdout.trim() ? found.stdout.trim() : wanted
  return souffleCache
}

/** What the agent is told before the first question of a conversation. */
function briefing(unit: string, souffle: string): string {
  return `You are answering a researcher's question about one Solidity contract, using the output of a static-analysis pipeline. Your working directory is one run of that pipeline; README.txt lists every file. Write only under scratch/ (create it if you need it); never edit the other files.

## What is in this folder
- source.sol: the flattened Solidity source exactly as compiled (unit name \`${unit}\`). Line numbers refer to it.
- program.dl: the whole Soufflé Datalog program that ran. Every relation is declared as \`.decl name(Col: type, ...)\` with a comment above it saying what it means; read that comment before interpreting a CSV. Layer 1 (rules/concepts.dl, sections 1a-1j) derives concepts from syntax: contract, function, param, stateVariable, storageSlot, stmt, condition, refs, callSite, argBinding, writeSite, readsDirect, assembly, ... Layers 2-5 (rules/lib.dl) derive the analysis: entryPoint, calls, transitivelyCalls, writes, writesIn, aliases, opaqueWrite, within, stmtOf, aborts, alwaysReverts, senderCheck, checkPrincipal, weakCheck, alwaysChecksSender, sometimesChecksSender, gatedWrite, ungatedSite, writeClaim. rules/report.dl exports storageWriters, writeClaims, opaqueWrites.
- derived/<relation>.csv: every derived relation, tab-separated, no header, columns in .decl order (an empty relation is an empty file).
- facts/*.facts: layer 0, solc's AST written down as facts (node, loc, child, attr, num, ...). Rarely needed.
- report.md: the rendered report (storage writers per variable, write claims per entry point, entry points).

## Identifiers
Ids are readable strings. Contract: \`${unit}:<Name>\`. Function (modifiers and constructors alike): \`${unit}:<Contract>.<name>(<param types>)\`, e.g. \`${unit}:Foo.constructor(address,uint256)\`; in storageWriters the deployment pseudo entry point is the bare word \`constructor\`. State variable: \`${unit}:<Contract>.<name>\`. Parameter or local: \`<function>/<name>@<byte offset>\`. Site (statement, call, write): \`<function>@<byte offset>:<length>\`. derived/sourceLoc.csv maps any id to (file, start line, end line, offset, length); derived/located.csv maps an id to its AST node id.

## How to work
1. Start from report.md and the headline relations (writeClaims, storageWriters, writes, entryPoint), then follow the chain down: writeSite -> stmt / condition / refs -> source lines. grep, cut and awk on the tab-separated CSVs are enough.
2. The claims in writeClaims are syntactic heuristics (Trust column: "sound" or "heuristic"). Do not repeat them as truth: check each against the source and say when a claim is too kind or too harsh, and why.
3. If the question needs a fact no relation states, write a Datalog query: put new rules in scratch/extra.dl (declare each new relation with .decl and add .output for it), then run
     cat program.dl scratch/extra.dl > scratch/q.dl && ${souffle} --no-preprocessor -F facts -D scratch/out scratch/q.dl
   and read scratch/out/<relation>.csv. Quote the rules you added in the answer.
4. To see why a tuple holds: printf 'setdepth 30\\nexplain writeClaims("...", ..., 25)\\nexit\\n' | ${souffle} --no-preprocessor -t explain -F facts -D scratch/out program.dl  (strings in double quotes, numbers bare). It takes seconds; use it sparingly.
5. Be concise: a researcher should be able to verify the answer in a minute.

## Answer format (Markdown)
- One or two sentences of verdict first.
- Then **Evidence**: bullets, each citing a derived tuple, a source line, or both. Write tuples as Datalog atoms in backticks copied from the CSV rows, e.g. \`writeSite("<W>", "<S>", "<F>", "<V>", "=")\`: strings in double quotes, numbers bare, all columns in .decl order, ids complete (with the \`${unit}:\` prefix). Write source lines as \`L25\` or \`L24-L27\`. The explorer turns these into links, so exactness matters.
- Then, if relevant, **What the rules do not capture**: what you concluded from reading the code that no relation states, and the rule that would state it.
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
  const souffle = souffleBinary()
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
    : `${briefing(unit, souffle)}\n\n## Question\n\n${question}`
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
