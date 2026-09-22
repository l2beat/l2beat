/**
 * `ModelClient` over the `opencode` command line (opencode 1.18.32).
 *
 * opencode is the way to put other providers' models (DeepSeek, Gemini, …)
 * behind the same authoring loop as Codex, so a benchmark can vary the model
 * and nothing else. Every turn is one `opencode run --format json` process
 * with the prompt on stdin. Isolation is by configuration rather than flags:
 * the process runs in a scratch directory whose `opencode.json` disables
 * every tool (`"tools": {"*": false}`), which also drops the tool schemas
 * from the request, and `--pure` keeps user plugins out. The event stream is
 * then checked for tool parts and a turn that shows one is refused, so the
 * guarantee is verified, not assumed. Repair rounds continue the session by
 * id with `--session`.
 *
 * Structured output is not requested: the plan schema travels in the prompt
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
} from '../codex/ModelClient'
import { type ProcessRun, runProcess } from '../process'
import {
  type ParsedOpenCodeEvents,
  parseOpenCodeEvents,
} from './opencodeEvents'

export interface OpenCodeClientOptions {
  /** `provider/model`, as `opencode models` lists them; required. */
  model: string
  /** Executable name or path; default `opencode` on PATH. */
  binary?: string
  /** Provider-specific reasoning effort, passed as `--variant`. */
  variant?: string
  timeoutMs?: number
}

/** Shorter than Codex's: a turn that runs this long has hung on a tool prompt, not on thinking. */
export const DEFAULT_OPENCODE_TIMEOUT_MS = 8 * 60 * 1_000

/** Written into the scratch working directory before every turn. */
export const OPENCODE_ISOLATION_CONFIG = {
  $schema: 'https://opencode.ai/config.json',
  tools: { '*': false },
  instructions: ['NO_TOOLS.md'],
} as const

/**
 * Some models emit tool calls from habit even when no tool is offered; the
 * turn is then refused. Saying so in the system prompt is cheaper than the
 * retry it would cost.
 */
export const NO_TOOLS_INSTRUCTION =
  'You have no tools in this session. Never call a tool. Answer from the message alone, with exactly the output it asks for.\n'

export class OpenCodeTurnError extends Error {
  constructor(
    message: string,
    readonly events: unknown[],
    readonly stderr: string,
  ) {
    super(message)
    this.name = 'OpenCodeTurnError'
  }
}

export class OpenCodeClient implements ModelClient {
  constructor(private readonly options: OpenCodeClientOptions) {}

  start(input: ModelTurnInput): Promise<ModelTurn> {
    return this.turn([], input)
  }

  resume(input: ModelResumeInput): Promise<ModelTurn> {
    return this.turn(['--session', input.threadId], input)
  }

  /**
   * A model that emits tool-call tokens although no tool was offered gets
   * one more fresh sample: the turn is refused either way, and a second
   * sample usually behaves. A resumed turn is not retried, because the
   * session already holds the first answer.
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
      return await this.attempt(sessionArgs, input)
    }
  }

  private async attempt(
    sessionArgs: string[],
    input: ModelTurnInput,
  ): Promise<ModelTurn> {
    const workDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'discovery-v2-opencode-'),
    )
    try {
      const configFile = path.join(workDir, 'opencode.json')
      fs.writeFileSync(configFile, JSON.stringify(OPENCODE_ISOLATION_CONFIG))
      fs.writeFileSync(path.join(workDir, 'NO_TOOLS.md'), NO_TOOLS_INSTRUCTION)
      const args = [
        'run',
        '--format',
        'json',
        '--pure',
        '--model',
        this.options.model,
        ...(this.options.variant === undefined
          ? []
          : ['--variant', this.options.variant]),
        ...sessionArgs,
      ]
      const started = Date.now()
      const run = await runProcess(
        this.options.binary ?? 'opencode',
        args,
        input.prompt,
        workDir,
        { ...process.env, OPENCODE_CONFIG: configFile },
        this.options.timeoutMs ?? DEFAULT_OPENCODE_TIMEOUT_MS,
      )
      return this.toTurn(run, Date.now() - started)
    } finally {
      fs.rmSync(workDir, { recursive: true, force: true })
    }
  }

  private toTurn(run: ProcessRun, durationMs: number): ModelTurn {
    const parsed = parseOpenCodeEvents(run.stdout)
    const problem = describeProblem(run, parsed)
    if (problem !== undefined) {
      throw new OpenCodeTurnError(
        `${problem}${stderrTail(run.stderr)}`,
        parsed.events,
        run.stderr,
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

/** Why a turn is refused, most fundamental first; mirrors the Codex client. */
function describeProblem(
  run: ProcessRun,
  parsed: ParsedOpenCodeEvents,
): string | undefined {
  if (run.timedOut) {
    return `opencode did not finish within ${run.timeoutMs} ms and was killed`
  }
  if (parsed.toolParts.length > 0) {
    return `opencode turn used tools despite the isolation config: ${parsed.toolParts.join('; ')}`
  }
  if (parsed.errors.length > 0) {
    return `opencode reported an error: ${parsed.errors.join('; ')}`
  }
  if (run.exitCode !== 0) {
    return `opencode exited with code ${run.exitCode}`
  }
  if (parsed.sessionId === undefined) {
    return 'opencode emitted no sessionID'
  }
  if (parsed.text === undefined) {
    return 'opencode produced no text'
  }
  return undefined
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
