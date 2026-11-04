/**
 * `ModelClient` over the `codex` command line (codex-cli 0.160.1).
 *
 * Every turn is one `codex exec` process. The prompt goes in on stdin so the
 * model never needs to read a file, and the request offers the model no
 * tool: the shell, web search, sub-agents, the ChatGPT apps (with the MCP
 * resource readers that come with them), plugins and the tool suggestions
 * that install them, `view_image`, goals and `request_user_input` are each
 * switched off, the sandbox is read-only, and the user's `config.toml` is
 * ignored (which is where MCP servers would come from;
 * `--ignore-user-config` still uses the stored login). A test runs the
 * installed codex against a local endpoint and checks that the tool list of
 * the request is empty. The one tool no setting removes is `apply_patch`
 * for a model whose catalogue entry asks for it (gpt-5.5 at the time of
 * writing); the read-only sandbox refuses the write.
 *
 * Codex's own coding-agent instructions are replaced by the templatizer's
 * system prompt (`model_instructions_file`), no project `AGENTS.md` is
 * looked for (`project_doc_max_bytes=0`; the turn runs in a fresh temporary
 * directory outside any repository anyway), and the environment message
 * naming the cwd and shell is not sent (`include_environment_context=false`).
 * What Codex still adds, and no documented setting removes, is the user's
 * global `$CODEX_HOME/AGENTS.md` (or `AGENTS.override.md`), and its
 * catalogue of the skills installed on the machine (names and descriptions
 * of local SKILL.md files, which the model has no tool to read). Another
 * `CODEX_HOME` would keep the global file out, but the login lives there,
 * and a copy of it that refreshes its token leaves the user's own login
 * with a refresh token already used. The event stream is
 * then checked for any tool item, and a turn that shows one is refused, so
 * "no tool ran" is verified, not assumed. The first turn is not
 * `--ephemeral` because repair rounds resume the thread by id, and an
 * ephemeral thread cannot be resumed.
 *
 * `--output-schema` is off by default. The OpenAI structured-output endpoint
 * behind it is strict: it rejects `const` without `type`, and demands that
 * every object carry `additionalProperties: false` and that every property be
 * required. The reply cannot meet that: it is a part of V1's template, whose
 * handler definitions have optional keys, and a blip `edit` or an event
 * `where` is open by design. The prompt carries the schema as text instead
 * and the loop validates the reply; the option remains for the day the
 * schema becomes strict-compatible.
 *
 * The model name is not in the JSONL events; it is read from the thread's
 * rollout file under `$CODEX_HOME/sessions`, best effort, because the
 * provenance header of a written template should say which model drafted it.
 * When Codex reroutes the turn to another model, it says so in an error item,
 * and that model is the one recorded.
 *
 * The usage of a resumed turn is the thread's total so far: Codex restores
 * the total from the rollout and adds the turn to it. The client keeps the
 * last total of every thread it ran and reports a turn's difference from it;
 * a thread first seen on a resume, started by another process, reports its
 * total.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
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
  ModelUsage,
} from './ModelClient'
import { type ProcessRun, runProcess } from './process'
import { TOOL_SYSTEM_PROMPT } from './toolSystemPrompt'
import { notAnswering, type TurnProblem, unusableAnswer } from './turnProblem'

/** What the OpenAI API accepts as `reasoning.effort` (its own error lists them); a model may take fewer. */
export const REASONING_EFFORTS = [
  'none',
  'minimal',
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
] as const
export type ReasoningEffort = (typeof REASONING_EFFORTS)[number]

export interface CodexClientOptions {
  /** Executable name on PATH or absolute path (the turn runs in a scratch directory); default `codex`. */
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

/** Every turn, first or resumed, runs with exactly these, plus the instructions file of its directory. */
export const CODEX_ISOLATION_FLAGS: readonly string[] = [
  '--skip-git-repo-check',
  '--ignore-user-config',
  '-c',
  'sandbox_mode="read-only"',
  '-c',
  'features.shell_tool=false',
  '-c',
  'web_search="disabled"',
  '-c',
  'agents.enabled=false',
  // With a ChatGPT login the apps bring `mcp__codex_apps__*` (GitHub, a
  // search service with internet access, …) and the MCP resource readers.
  '-c',
  'features.apps=false',
  // Either of these two alone brings back `request_plugin_install`.
  '-c',
  'features.plugins=false',
  '-c',
  'features.tool_suggest=false',
  '-c',
  'features.view_image=false',
  '-c',
  'features.goals=false',
  '-c',
  'tools.experimental_request_user_input={enabled=false}',
  '-c',
  'project_doc_max_bytes=0',
  '-c',
  'include_environment_context=false',
]

/** Holds `TOOL_SYSTEM_PROMPT` in the turn's directory; Codex sends its contents in place of its built-in instructions. */
export const CODEX_INSTRUCTIONS_FILE = 'instructions.md'

export const DEFAULT_CODEX_TIMEOUT_MS = 15 * 60 * 1_000

export class CodexTurnError extends Error {
  constructor(
    message: string,
    readonly events: unknown[],
    readonly stderr: string,
    /** See `isRetryable`: only an unusable answer is worth asking again. */
    readonly retryable = false,
    /** What the refused turn cost, when the events reported it. */
    readonly usage?: ModelUsage,
  ) {
    super(message)
    this.name = 'CodexTurnError'
  }
}

export class CodexClient implements ModelClient {
  /** The usage each thread last reported, which is its total so far. */
  private readonly threadTotals = new Map<string, ModelUsage>()

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
    // The real path, which codex sees as its cwd: on macOS the temporary
    // directory is under /var, a symlink to /private/var.
    const workDir = fs.realpathSync(
      fs.mkdtempSync(path.join(os.tmpdir(), 'discovery-templatizer-codex-')),
    )
    try {
      const lastMessageFile = path.join(workDir, 'last-message.txt')
      const args = [
        ...command,
        ...CODEX_ISOLATION_FLAGS,
        ...instructionsFlags(workDir),
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
    const usage = this.turnUsage(parsed)
    const problem = describeProblem(run, parsed, text)
    if (problem !== undefined) {
      throw new CodexTurnError(
        `${problem.message}${stderrTail(run.stderr)}`,
        parsed.events,
        run.stderr,
        problem.retryable,
        usage,
      )
    }
    const threadId = parsed.threadId as string
    return {
      threadId,
      text: text as string,
      model:
        parsed.reroutedTo ??
        this.options.model ??
        readModelFromRollout(this.sessionsDir(), threadId),
      usage,
      events: parsed.events,
      durationMs,
    }
  }

  private turnUsage(parsed: ParsedCodexEvents): ModelUsage | undefined {
    const total = parsed.usage
    if (total === undefined || parsed.threadId === undefined) {
      return total
    }
    const before = this.threadTotals.get(parsed.threadId)
    this.threadTotals.set(parsed.threadId, total)
    return before === undefined ? total : subtractUsage(total, before)
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
 * an error matters only when the turn did not complete (see `codexEvents`),
 * a turn that did not complete has no answer even without one, and only a
 * clean turn is required to carry a thread id and a message.
 */
function describeProblem(
  run: ProcessRun,
  parsed: ParsedCodexEvents,
  text: string | undefined,
): TurnProblem | undefined {
  if (run.timedOut) {
    return notAnswering(
      `codex did not finish within ${run.timeoutMs} ms and was killed`,
    )
  }
  if (parsed.toolItems.length > 0) {
    return unusableAnswer(
      `codex turn used tools despite isolation flags: ${parsed.toolItems.join('; ')}`,
    )
  }
  if (parsed.failure !== undefined) {
    return notAnswering(`codex turn failed: ${parsed.failure}`)
  }
  if (!parsed.completed && parsed.errors.length > 0) {
    return notAnswering(`codex reported an error: ${parsed.errors.join('; ')}`)
  }
  if (run.exitCode !== 0) {
    return notAnswering(`codex exited with code ${run.exitCode}`)
  }
  if (!parsed.completed) {
    return notAnswering('codex ended without turn.completed')
  }
  if (parsed.threadId === undefined) {
    return notAnswering('codex emitted no thread.started')
  }
  if (text === undefined || text.trim() === '') {
    return unusableAnswer('codex produced no final message')
  }
  return undefined
}

function instructionsFlags(workDir: string): string[] {
  const file = path.join(workDir, CODEX_INSTRUCTIONS_FILE)
  fs.writeFileSync(file, TOOL_SYSTEM_PROMPT)
  return ['-c', `model_instructions_file=${JSON.stringify(file)}`]
}

function readLastMessage(file: string): string | undefined {
  if (!fs.existsSync(file)) {
    return undefined
  }
  const text = fs.readFileSync(file, 'utf8')
  return text.trim() === '' ? undefined : text
}

function subtractUsage(total: ModelUsage, before: ModelUsage): ModelUsage {
  const minus = (a?: number, b?: number) =>
    a === undefined || b === undefined ? a : a - b
  return {
    inputTokens: minus(total.inputTokens, before.inputTokens),
    cachedInputTokens: minus(total.cachedInputTokens, before.cachedInputTokens),
    outputTokens: minus(total.outputTokens, before.outputTokens),
    reasoningOutputTokens: minus(
      total.reasoningOutputTokens,
      before.reasoningOutputTokens,
    ),
  }
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

/**
 * The `model` of the thread's last `turn_context`, or undefined when the
 * rollout cannot be found or read. The sessions directory is shared with
 * every other Codex session on the machine, and an entry that goes while
 * it is scanned must not cost a finished turn its answer.
 */
export function readModelFromRollout(
  sessionsDir: string,
  threadId: string,
): string | undefined {
  let text: string
  try {
    const file = findRolloutFile(sessionsDir, `-${threadId}.jsonl`)
    if (file === undefined) {
      return undefined
    }
    text = fs.readFileSync(file, 'utf8')
  } catch {
    return undefined
  }
  let model: string | undefined
  for (const line of text.split('\n')) {
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
