import { spawn } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { JudgeUsage } from '../types.js'
import type { JudgeEngine } from './Judge.js'

/** Runs `codex exec` headless with a forced output schema, no MCP servers, no workspace. */
export class CodexJudgeEngine implements JudgeEngine {
  readonly name = 'codex-exec'

  constructor(readonly model?: string) {}

  async run(prompt: string, schema: object) {
    const dir = mkdtempSync(join(tmpdir(), 'ai-review-judge-'))
    const schemaPath = join(dir, 'schema.json')
    const outputPath = join(dir, 'output.json')
    writeFileSync(schemaPath, JSON.stringify(schema))
    const args = [
      'exec',
      '--json',
      '--ephemeral',
      '--skip-git-repo-check',
      '--ignore-user-config',
      '--sandbox',
      'read-only',
      '-C',
      dir,
      '--output-schema',
      schemaPath,
      '-o',
      outputPath,
      ...(this.model ? ['-m', this.model] : []),
      '-',
    ]
    const started = Date.now()
    try {
      const events = await runCodex(args, prompt)
      const text = readFileSync(outputPath, 'utf8')
      return {
        text,
        usage: extractUsage(events),
        latencyMs: Date.now() - started,
      }
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  }
}

function runCodex(args: string[], stdin: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const child = spawn('codex', args, { stdio: ['pipe', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (d) => {
      stdout += d
    })
    child.stderr.on('data', (d) => {
      stderr += d
    })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code !== 0) {
        reject(
          new Error(`codex exec exited with ${code}: ${stderr.slice(-2000)}`),
        )
      } else {
        resolve(stdout.split('\n').filter(Boolean))
      }
    })
    child.stdin.end(stdin)
  })
}

function extractUsage(events: string[]): JudgeUsage | undefined {
  for (const line of events.reverse()) {
    try {
      const event = JSON.parse(line) as {
        usage?: {
          input_tokens?: number
          cached_input_tokens?: number
          output_tokens?: number
        }
      }
      if (event.usage) {
        return {
          inputTokens: event.usage.input_tokens ?? 0,
          cachedInputTokens: event.usage.cached_input_tokens ?? 0,
          outputTokens: event.usage.output_tokens ?? 0,
        }
      }
    } catch {}
  }
  return undefined
}
