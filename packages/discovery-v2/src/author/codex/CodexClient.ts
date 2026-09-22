/**
 * `ModelClient` over the `codex` command line (codex-cli 0.155.1).
 *
 * Every turn is one `codex exec` process. The prompt goes in on stdin so the
 * model never needs to read a file, and the model gets nothing else: a
 * read-only sandbox, the shell tool disabled, web search disabled and the
 * user's `config.toml` ignored (which is where MCP servers would come from;
 * `--ignore-user-config` still uses the stored login). The event stream is
 * then checked for any tool item, and a turn that shows one is refused, so
 * "no tool ran" is verified, not assumed. The first turn is not `--ephemeral`
 * because repair rounds resume the thread by id, and an ephemeral thread
 * cannot be resumed.
 *
 * `--output-schema` is off by default. The OpenAI structured-output endpoint
 * behind it is strict: it rejected the plan schema first for `const` without
 * `type`, then because every object must carry `additionalProperties: false`
 * and every property must be required. Recipe `args` is an open object by
 * design (each recipe has its own argument schema), so the plan schema cannot
 * be made strict without changing the plan format. The prompt carries the
 * schema as text instead and the loop validates with `validateSchema`; the
 * option remains for the day the schema becomes strict-compatible.
 *
 * The model name is not in the JSONL events; it is read from the thread's
 * rollout file under `$CODEX_HOME/sessions`, best effort, because the
 * provenance stored with a plan should say which model wrote it.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import { type ProcessRun, runProcess } from '../process'
import {
  type CodexEvent,
  type ParsedCodexEvents,
  parseCodexEvents,
} from './codexEvents'
import type {
  ModelClient,
  ModelResumeInput,
  ModelTurn,
  ModelTurnInput,
} from './ModelClient'

export type ReasoningEffort = 'low' | 'medium' | 'high'
export const REASONING_EFFORTS: readonly ReasoningEffort[] = [
  'low',
  'medium',
  'high',
]

export interface CodexClientOptions {
  /** Executable name or path; default `codex` on PATH. */
  binary?: string
  model?: string
  reasoningEffort?: ReasoningEffort
  /** Wall-clock limit per turn, after which the process group is killed. */
  timeoutMs?: number
  /** Pass the schema as `--output-schema`; see the module header for why this is off. */
  outputSchema?: boolean
  /** Where Codex keeps sessions and auth; default `$CODEX_HOME` or `~/.codex`. */
  codexHome?: string
}

/** Every turn, first or resumed, runs with exactly these. */
export const CODEX_ISOLATION_FLAGS: readonly string[] = [
  '--skip-git-repo-check',
  '--ignore-user-config',
  '-c',
  'sandbox_mode="read-only"',
  '-c',
  'features.shell_tool=false',
  '-c',
  'web_search="disabled"',
]

export const DEFAULT_CODEX_TIMEOUT_MS = 15 * 60 * 1_000

export class CodexTurnError extends Error {
  constructor(
    message: string,
    readonly events: unknown[],
    readonly stderr: string,
  ) {
    super(message)
    this.name = 'CodexTurnError'
  }
}

export class CodexClient implements ModelClient {
  constructor(private readonly options: CodexClientOptions = {}) {}

  start(input: ModelTurnInput): Promise<ModelTurn> {
    return this.turn(['exec'], input)
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    return this.turn(['exec', 'resume', input.threadId], input)
  }

  private async turn(
    command: string[],
    input: ModelTurnInput,
  ): Promise<ModelTurn> {
    const workDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'discovery-v2-codex-'),
    )
    try {
      const lastMessageFile = path.join(workDir, 'last-message.txt')
      const args = [
        ...command,
        ...CODEX_ISOLATION_FLAGS,
        '--json',
        '--output-last-message',
        lastMessageFile,
        ...this.modelFlags(),
        ...this.schemaFlags(workDir, input.schema),
        '-',
      ]
      const started = Date.now()
      const run = await runProcess(
        this.options.binary ?? 'codex',
        args,
        input.prompt,
        workDir,
        this.env(),
        this.options.timeoutMs ?? DEFAULT_CODEX_TIMEOUT_MS,
      )
      const durationMs = Date.now() - started
      return this.toTurn(run, lastMessageFile, durationMs)
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true })
    }
  }

  private modelFlags(): string[] {
    const flags: string[] = []
    if (this.options.model !== undefined) {
      flags.push('--model', this.options.model)
    }
    if (this.options.reasoningEffort !== undefined) {
      flags.push(
        '-c',
        `model_reasoning_effort="${this.options.reasoningEffort}"`,
      )
    }
    return flags
  }

  private schemaFlags(workDir: string, schema: object): string[] {
    if (this.options.outputSchema !== true) {
      return []
    }
    const file = path.join(workDir, 'output-schema.json')
    fs.writeFileSync(file, JSON.stringify(schema))
    return ['--output-schema', file]
  }

  private env(): NodeJS.ProcessEnv {
    return this.options.codexHome === undefined
      ? process.env
      : { ...process.env, CODEX_HOME: this.options.codexHome }
  }

  private toTurn(
    run: ProcessRun,
    lastMessageFile: string,
    durationMs: number,
  ): ModelTurn {
    const parsed = parseCodexEvents(run.stdout)
    const text = readLastMessage(lastMessageFile) ?? parsed.lastMessage
    const problem = describeProblem(run, parsed, text)
    if (problem !== undefined) {
      throw new CodexTurnError(
        `${problem}${stderrTail(run.stderr)}`,
        parsed.events,
        run.stderr,
      )
    }
    const threadId = parsed.threadId as string
    return {
      threadId,
      text: text as string,
      model:
        this.options.model ??
        readModelFromRollout(this.sessionsDir(), threadId),
      usage: parsed.usage,
      events: parsed.events,
      durationMs,
    }
  }

  private sessionsDir(): string {
    const home =
      this.options.codexHome ??
      process.env.CODEX_HOME ??
      path.join(os.homedir(), '.codex')
    return path.join(home, 'sessions')
  }
}

/**
 * Why a turn is refused, most fundamental first: a killed process has no
 * meaningful events, a tool item taints the answer whatever else happened,
 * and only a clean turn is required to carry a thread id and a message.
 */
function describeProblem(
  run: ProcessRun,
  parsed: ParsedCodexEvents,
  text: string | undefined,
): string | undefined {
  if (run.timedOut) {
    return `codex did not finish within ${run.timeoutMs} ms and was killed`
  }
  if (parsed.toolItems.length > 0) {
    return `codex turn used tools despite isolation flags: ${parsed.toolItems.join('; ')}`
  }
  if (parsed.errors.length > 0) {
    return `codex reported an error: ${parsed.errors.join('; ')}`
  }
  if (run.exitCode !== 0) {
    return `codex exited with code ${run.exitCode}`
  }
  if (parsed.threadId === undefined) {
    return 'codex emitted no thread.started'
  }
  if (text === undefined) {
    return 'codex produced no final message'
  }
  return undefined
}

function readLastMessage(file: string): string | undefined {
  if (!fs.existsSync(file)) {
    return undefined
  }
  const text = fs.readFileSync(file, 'utf8')
  return text.trim() === '' ? undefined : text
}

function stderrTail(stderr: string): string {
  const relevant = stderr
    .split('\n')
    .filter(
      (line) =>
        line.trim() !== '' && !line.startsWith('Reading additional input'),
    )
  if (relevant.length === 0) {
    return ''
  }
  return `\nstderr: ${relevant.slice(-10).join('\n')}`
}

/** The `model` of the thread's last `turn_context`, or undefined when the rollout cannot be found. */
export function readModelFromRollout(
  sessionsDir: string,
  threadId: string,
): string | undefined {
  const file = findRolloutFile(sessionsDir, `-${threadId}.jsonl`)
  if (file === undefined) {
    return undefined
  }
  let model: string | undefined
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const event = tryParse(line)
    if (event?.type === 'turn_context') {
      const payload = event.payload
      if (isRecord(payload) && typeof payload.model === 'string') {
        model = payload.model
      }
    }
  }
  return model
}

function findRolloutFile(
  directory: string,
  suffix: string,
): string | undefined {
  if (!fs.existsSync(directory)) {
    return undefined
  }
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      const found = findRolloutFile(full, suffix)
      if (found !== undefined) {
        return found
      }
    } else if (entry.name.endsWith(suffix)) {
      return full
    }
  }
  return undefined
}

function tryParse(line: string): CodexEvent | undefined {
  try {
    const value: unknown = JSON.parse(line)
    return isRecord(value) ? (value as CodexEvent) : undefined
  } catch {
    return undefined
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
