/**
 * `ModelClient` over the `opencode` command line (opencode 1.18.34).
 *
 * opencode is the way to put other providers' models (DeepSeek, Gemini, …)
 * behind the same templatizer loop as Codex, so `--ai-model` varies the model
 * and nothing else. Every turn is one `opencode run --format json` process
 * with the prompt on stdin. Isolation is by configuration rather than flags:
 * the process runs in a scratch directory whose `opencode.json` disables
 * every tool (`"tools": {"*": false}`), which also drops the tool schemas
 * from the request, and defines the agent the turn runs as, whose `prompt`
 * stands in for opencode's own coding-agent system prompt. opencode merges
 * that file into every other config it finds rather than using it instead,
 * and a `"permission": {"bash": "allow"}` in the user's global config, or
 * in an `opencode.json` in any directory above the scratch one, or in
 * `OPENCODE_PERMISSION`, brings `bash` back into the request. So the
 * global config directory is pointed at an empty one (opencode installs
 * its plugin package there, once per run), the search for project configs
 * is switched off, and the variables that name or hold other config are
 * dropped; the login is kept, because it lives in the data directory. `--pure` keeps user plugins
 * out and an environment flag keeps the user's `CLAUDE.md` out. A test runs
 * the installed opencode against a local endpoint and checks that the tool
 * list of the request is empty, and the event stream is checked for tool
 * parts, a turn that shows one being refused, so the guarantee is verified,
 * not assumed. Repair rounds continue the session by id with `--session`.
 *
 * Structured output is not requested: the draft schema travels in the prompt
 * as text, as it does for Codex, and the loop validates the reply.
 */
import fs from 'fs'
import os from 'os'
import path from 'path'
import type {
  ModelClient,
  ModelResumeInput,
  ModelTurn,
  ModelTurnInput,
  ModelUsage,
} from './ModelClient'
import {
  type ParsedOpenCodeEvents,
  parseOpenCodeEvents,
} from './opencodeEvents'
import { type ProcessRun, runProcess } from './process'
import { TOOL_SYSTEM_PROMPT } from './toolSystemPrompt'
import { notAnswering, type TurnProblem, unusableAnswer } from './turnProblem'

export interface OpenCodeClientOptions {
  /** `provider/model`, as `opencode models` lists them; required. */
  model: string
  /** Executable name on PATH or absolute path (the turn runs in a scratch directory); default `opencode`. */
  binary?: string
  /** Provider-specific reasoning effort, passed as `--variant`. */
  variant?: string
  timeoutMs?: number
}

/**
 * The same as Codex's. At the default effort a DeepSeek turn has thought
 * for six minutes before answering, so eight cut real answers off; a turn
 * past fifteen has hung rather than thought.
 */
export const DEFAULT_OPENCODE_TIMEOUT_MS = 15 * 60 * 1_000

/** The agent every turn runs as; `--agent` names it, the config below defines it. */
export const OPENCODE_AGENT = 'templatizer'

/**
 * Written into the scratch working directory once per run. A configured
 * agent's `prompt` replaces opencode's default system prompt outright
 * (`session/llm/request.ts`: `agent.prompt ? [agent.prompt] :
 * SystemPrompt.provider(model)`); what opencode still adds after it is its
 * environment block (model, the scratch directory, platform, date) and any
 * instruction file it finds, which the empty directory and
 * `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` keep to none.
 */
export const OPENCODE_ISOLATION_CONFIG = {
  $schema: 'https://opencode.ai/config.json',
  tools: { '*': false },
  agent: {
    [OPENCODE_AGENT]: { mode: 'primary', prompt: TOOL_SYSTEM_PROMPT },
  },
} as const

/**
 * opencode cuts a turn at 32,000 output tokens unless told otherwise, and a
 * reasoning model's thinking counts against that budget: in quick-suite
 * run 3 every turn that "produced no text" had thought for exactly 32,000
 * tokens and was cut before its answer, and two more answers were cut
 * mid-JSON at the same mark. 128,000 is four times that. It is not the
 * model's own maximum because opencode reserves the budget out of the
 * context window and compacts the session when the rest cannot hold the
 * prompt, and some gateway models allow as much output as they have context.
 */
export const OPENCODE_OUTPUT_TOKEN_MAX = 128_000

export class OpenCodeTurnError extends Error {
  constructor(
    message: string,
    readonly events: unknown[],
    readonly stderr: string,
    /** See `isRetryable`: only an unusable answer is worth asking again. */
    readonly retryable = false,
    /** What the refused turn cost, so that a resample can count it. */
    readonly usage?: ModelUsage,
    readonly durationMs = 0,
  ) {
    super(message)
    this.name = 'OpenCodeTurnError'
  }
}

export class OpenCodeClient implements ModelClient {
  /** See `scratchDir`. */
  private scratch: string | undefined

  constructor(private readonly options: OpenCodeClientOptions) {}

  start(input: ModelTurnInput): Promise<ModelTurn> {
    return this.turn([], input)
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    return this.turn(['--session', input.threadId], input)
  }

  /**
   * A model that emits tool-call tokens although no tool was offered gets
   * one more fresh sample within the same round: the turn is refused
   * either way, and a second sample usually behaves. A resumed turn is not
   * retried, because the session already holds the first answer.
   */
  private async turn(
    sessionArgs: string[],
    input: ModelTurnInput,
  ): Promise<ModelTurn> {
    try {
      return await this.attempt(sessionArgs, input)
    } catch (error) {
      if (sessionArgs.length > 0 || !isToolUse(error)) {
        throw error
      }
      return await this.resample(input, error as OpenCodeTurnError)
    }
  }

  /**
   * The refused sample stays part of the turn: its events go to the trail,
   * which is the evidence that no tool ran, and its tokens and time count
   * in the turn's.
   */
  private async resample(
    input: ModelTurnInput,
    refused: OpenCodeTurnError,
  ): Promise<ModelTurn> {
    let turn: ModelTurn
    try {
      turn = await this.attempt([], input)
    } catch (error) {
      if (!(error instanceof OpenCodeTurnError)) {
        throw error
      }
      throw new OpenCodeTurnError(
        error.message,
        [...refused.events, ...error.events],
        error.stderr,
        error.retryable,
        addUsage(refused.usage, error.usage),
        refused.durationMs + error.durationMs,
      )
    }
    return {
      ...turn,
      events: [...refused.events, ...turn.events],
      usage: addUsage(refused.usage, turn.usage),
      durationMs: refused.durationMs + turn.durationMs,
    }
  }

  private async attempt(
    sessionArgs: string[],
    input: ModelTurnInput,
  ): Promise<ModelTurn> {
    const workDir = this.scratchDir()
    const args = [
      'run',
      '--format',
      'json',
      '--pure',
      // opencode takes its directory from $PWD, not from the process cwd,
      // so without these two the model is told it works in the discovery
      // package, inside a git repository, and reads the repository's
      // AGENTS.md: that is what made DeepSeek "explore the repository"
      // with shell commands instead of answering.
      '--dir',
      workDir,
      '--model',
      this.options.model,
      '--agent',
      OPENCODE_AGENT,
      ...(this.options.variant === undefined
        ? []
        : ['--variant', this.options.variant]),
      // A new session without a title has opencode ask the model for one,
      // in a second request that carries the whole prompt and whose tokens
      // no event reports. A resumed session keeps the title it got.
      ...(sessionArgs.length > 0 ? sessionArgs : ['--title', 'templatizer']),
    ]
    const started = Date.now()
    const run = await runProcess(
      this.options.binary ?? 'opencode',
      args,
      input.prompt,
      workDir,
      openCodeEnvironment(workDir),
      this.options.timeoutMs ?? DEFAULT_OPENCODE_TIMEOUT_MS,
    )
    return this.toTurn(run, Date.now() - started)
  }

  /**
   * One empty directory per client, holding only the isolation config, for
   * every turn of the run. One and not one per turn, because opencode keeps
   * its sessions per directory: a repair turn resumed from another
   * directory fails with "Unexpected server error". Removed when the
   * process exits, which is when the sessions end.
   */
  private scratchDir(): string {
    if (this.scratch === undefined) {
      const workDir = fs.mkdtempSync(
        path.join(os.tmpdir(), 'discovery-templatizer-opencode-'),
      )
      fs.writeFileSync(
        path.join(workDir, 'opencode.json'),
        JSON.stringify(OPENCODE_ISOLATION_CONFIG),
      )
      fs.mkdirSync(path.join(workDir, 'config'))
      process.once('exit', () =>
        fs.rmSync(workDir, { recursive: true, force: true }),
      )
      this.scratch = workDir
    }
    return this.scratch
  }

  private toTurn(run: ProcessRun, durationMs: number): ModelTurn {
    const parsed = parseOpenCodeEvents(run.stdout)
    const problem = describeProblem(run, parsed)
    if (problem !== undefined) {
      throw new OpenCodeTurnError(
        `${problem.message}${stderrTail(run.stderr)}`,
        parsed.events,
        run.stderr,
        problem.retryable,
        parsed.usage,
        durationMs,
      )
    }
    return {
      threadId: parsed.sessionId as string,
      text: parsed.text as string,
      model: this.options.model,
      usage: parsed.usage,
      events: parsed.events,
      durationMs,
    }
  }
}

function openCodeEnvironment(workDir: string): NodeJS.ProcessEnv {
  const {
    OPENCODE_CONFIG_CONTENT: _content,
    OPENCODE_CONFIG_DIR: _directory,
    OPENCODE_PERMISSION: _permission,
    ...env
  } = process.env
  return {
    ...env,
    PWD: workDir,
    OPENCODE_CONFIG: path.join(workDir, 'opencode.json'),
    XDG_CONFIG_HOME: path.join(workDir, 'config'),
    // `OPENCODE_CONFIG` still loads; only the search upwards for an
    // `opencode.json` stops, which from the scratch directory reaches /tmp.
    OPENCODE_DISABLE_PROJECT_CONFIG: '1',
    OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX: String(OPENCODE_OUTPUT_TOKEN_MAX),
    // Without it opencode appends the user's ~/.claude/CLAUDE.md, the one
    // instruction file the empty scratch directory does not keep out.
    OPENCODE_DISABLE_CLAUDE_CODE_PROMPT: '1',
  }
}

/** Why a turn is refused, most fundamental first; mirrors the Codex client. */
function describeProblem(
  run: ProcessRun,
  parsed: ParsedOpenCodeEvents,
): TurnProblem | undefined {
  if (run.timedOut) {
    return notAnswering(
      `opencode did not finish within ${run.timeoutMs} ms and was killed`,
    )
  }
  if (parsed.toolParts.length > 0) {
    return unusableAnswer(
      `opencode turn used tools despite the isolation config: ${parsed.toolParts.join('; ')}`,
    )
  }
  if (parsed.errors.length > 0) {
    return notAnswering(
      `opencode reported an error: ${parsed.errors.join('; ')}`,
    )
  }
  if (run.exitCode !== 0) {
    return notAnswering(`opencode exited with code ${run.exitCode}`)
  }
  if (parsed.sessionId === undefined) {
    return notAnswering('opencode emitted no sessionID')
  }
  if (parsed.text === undefined) {
    return unusableAnswer('opencode produced no text')
  }
  return undefined
}

function addUsage(
  a: ModelUsage | undefined,
  b: ModelUsage | undefined,
): ModelUsage | undefined {
  if (a === undefined || b === undefined) {
    return a ?? b
  }
  const add = (x?: number, y?: number) =>
    x === undefined && y === undefined ? undefined : (x ?? 0) + (y ?? 0)
  return {
    inputTokens: add(a.inputTokens, b.inputTokens),
    cachedInputTokens: add(a.cachedInputTokens, b.cachedInputTokens),
    outputTokens: add(a.outputTokens, b.outputTokens),
    reasoningOutputTokens: add(
      a.reasoningOutputTokens,
      b.reasoningOutputTokens,
    ),
  }
}

function isToolUse(error: unknown): boolean {
  return (
    error instanceof OpenCodeTurnError && error.message.includes('used tools')
  )
}

function stderrTail(stderr: string): string {
  const lines = stderr.split('\n').filter((line) => line.trim() !== '')
  return lines.length === 0 ? '' : `\nstderr: ${lines.slice(-10).join('\n')}`
}
