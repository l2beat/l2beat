import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { IAgent } from './IAgent'

const TIMEOUT_MS = 15 * 60 * 1000

/** Runs a prompt through the locally authenticated Codex CLI. */
export class CodexAgent implements IAgent {
  constructor(private readonly model: string) {}

  run(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn('codex', getCodexArgs(this.model), {
        // An empty working directory so no repo context leaks in.
        cwd: mkdtempSync(join(tmpdir(), 'daily-check-')),
        env: process.env,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''
      child.stdout.on('data', (data) => {
        stdout += data
      })
      child.stderr.on('data', (data) => {
        stderr += data
      })

      const timeout = setTimeout(() => {
        child.kill('SIGKILL')
        reject(new Error('codex exec timed out'))
      }, TIMEOUT_MS)

      child.on('error', (error) => {
        clearTimeout(timeout)
        reject(
          error.message.includes('ENOENT')
            ? new Error('codex CLI not found — is Codex installed?')
            : error,
        )
      })
      child.on('close', (code) => {
        clearTimeout(timeout)
        if (code !== 0) {
          reject(new Error(`codex exec exited with ${code}: ${stderr.trim()}`))
          return
        }
        resolve(stdout.trim() || 'Investigation produced no report.')
      })

      child.stdin.write(prompt)
      child.stdin.end()
    })
  }
}

export function getCodexArgs(model: string): string[] {
  return [
    'exec',
    '--model',
    model,
    '--sandbox',
    'workspace-write',
    '--config',
    'approval_policy="never"',
    '--config',
    'sandbox_workspace_write.network_access=true',
    '--skip-git-repo-check',
    '--ephemeral',
    '--ignore-user-config',
    '-',
  ]
}
