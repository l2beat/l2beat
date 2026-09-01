import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { type Execute, execute } from '../execute.js'
import type { Engine, EngineRequest, EngineResult } from '../types.js'
import { parseTranscript } from './parseTranscript.js'

export interface CodexOptions {
  model?: string
  reasoningEffort?: 'low' | 'medium' | 'high'
}

/** Runs `codex exec --json` headless and interprets its transcript. */
export class CodexEngine implements Engine {
  readonly name: string

  constructor(
    private readonly options: CodexOptions = {},
    private readonly exec: Execute = execute,
  ) {
    this.name = `codex${options.model ? `:${options.model}` : ''}`
  }

  buildArgs(schemaPath: string): string[] {
    const args = [
      'exec',
      '--json',
      '--ephemeral',
      '--skip-git-repo-check',
      // Probes (targeted tests, typecheck) need to write build artifacts.
      '--sandbox',
      'workspace-write',
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

    const { stdout, stderr, timedOut, code } = await this.exec(
      'codex',
      this.buildArgs(schemaPath),
      {
        cwd: request.cwd,
        stdin: request.prompt,
        timeoutMs: request.budget.timeoutMs,
      },
    )
    const { usage, error, lastMessage, commands } = parseTranscript(stdout)
    const fail = (
      reason: Extract<EngineResult, { ok: false }>['reason'],
      detail: string,
    ): EngineResult => ({ ok: false, reason, detail, usage })

    if (timedOut) {
      return fail('timeout', `killed after ${request.budget.timeoutMs}ms`)
    }
    if (error || code !== 0) {
      return fail('engine-error', error ?? stderr.slice(-2000))
    }
    if (lastMessage === undefined) {
      return fail('invalid-output', 'no final message')
    }
    try {
      return { ok: true, output: JSON.parse(lastMessage), usage, commands }
    } catch {
      return fail('invalid-output', lastMessage.slice(0, 500))
    }
  }
}
