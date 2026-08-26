import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Engine, EngineRequest, EngineResult } from '../types.js'
import { parseTranscript, totalTokens } from './parseTranscript.js'

export interface CodexOptions {
  model?: string
  reasoningEffort?: 'low' | 'medium' | 'high'
  sandbox?: 'read-only' | 'workspace-write'
  binary?: string
}

export class CodexEngine implements Engine {
  readonly name: string

  constructor(private readonly options: CodexOptions = {}) {
    this.name = `codex${options.model ? `:${options.model}` : ''}`
  }

  buildArgs(schemaPath: string): string[] {
    const args = [
      'exec',
      '--json',
      '--ephemeral',
      '--skip-git-repo-check',
      '--sandbox',
      this.options.sandbox ?? 'read-only',
      '--output-schema',
      schemaPath,
    ]
    // Probes run PR code; keep them offline so a hostile diff cannot exfiltrate anything.
    args.push('-c', 'sandbox_workspace_write.network_access=false')
    if (this.options.model) args.push('--model', this.options.model)
    if (this.options.reasoningEffort) {
      args.push(
        '-c',
        `model_reasoning_effort="${this.options.reasoningEffort}"`,
      )
    }
    // prompt is read from stdin
    args.push('-')
    return args
  }

  async run(request: EngineRequest): Promise<EngineResult> {
    const dir = mkdtempSync(join(tmpdir(), 'ai-review-'))
    const schemaPath = join(dir, 'schema.json')
    writeFileSync(schemaPath, JSON.stringify(request.outputSchema))

    const { stdout, stderr, timedOut, code } = await execute(
      this.options.binary ?? 'codex',
      this.buildArgs(schemaPath),
      request.cwd,
      request.prompt,
      request.budget.timeoutMs,
    )
    const transcript = parseTranscript(stdout)

    if (timedOut) {
      return {
        ok: false,
        reason: 'timeout',
        detail: `killed after ${request.budget.timeoutMs}ms`,
        usage: transcript.usage,
      }
    }
    if (transcript.error || code !== 0) {
      return {
        ok: false,
        reason: 'engine-error',
        detail: transcript.error ?? stderr.slice(-2000),
        usage: transcript.usage,
      }
    }
    if (
      transcript.usage &&
      totalTokens(transcript.usage) > request.budget.maxTokens
    ) {
      return {
        ok: false,
        reason: 'over-budget',
        detail: `${totalTokens(transcript.usage)} tokens > cap ${request.budget.maxTokens}`,
        usage: transcript.usage,
      }
    }
    if (transcript.lastMessage === undefined) {
      return {
        ok: false,
        reason: 'invalid-output',
        detail: 'no final message',
        usage: transcript.usage,
      }
    }
    try {
      return {
        ok: true,
        output: JSON.parse(transcript.lastMessage),
        usage: transcript.usage ?? { input: 0, cachedInput: 0, output: 0 },
        commands: transcript.commands,
      }
    } catch {
      return {
        ok: false,
        reason: 'invalid-output',
        detail: transcript.lastMessage.slice(0, 500),
        usage: transcript.usage,
      }
    }
  }
}

function execute(
  binary: string,
  args: string[],
  cwd: string,
  stdin: string,
  timeoutMs: number,
) {
  return new Promise<{
    stdout: string
    stderr: string
    timedOut: boolean
    code: number | null
  }>((resolve) => {
    // Own process group so the timeout also kills probes Codex spawned.
    const child = spawn(binary, args, {
      cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: true,
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      killGroup(child.pid)
    }, timeoutMs)
    child.on('error', (err) => {
      stderr += String(err)
    })
    child.stdout.on('data', (d) => {
      stdout += d
    })
    child.stderr.on('data', (d) => {
      stderr += d
      process.stderr.write(d)
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      resolve({ stdout, stderr, timedOut, code })
    })
    child.stdin.end(stdin)
  })
}

function killGroup(pid: number | undefined) {
  if (pid === undefined) return
  try {
    process.kill(-pid, 'SIGKILL')
  } catch {
    process.kill(pid, 'SIGKILL')
  }
}
