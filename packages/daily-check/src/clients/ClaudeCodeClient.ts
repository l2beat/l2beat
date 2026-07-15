import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const TIMEOUT_MS = 15 * 60 * 1000
const MAX_TURNS = 40

/** Runs a prompt through the locally authenticated Claude Code CLI. */
export class ClaudeCodeClient {
  constructor(private readonly model: string) {}

  run(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const child = spawn(
        'claude',
        [
          '-p',
          '--output-format',
          'text',
          '--model',
          this.model,
          '--allowedTools',
          'Bash(curl:*)',
          '--max-turns',
          String(MAX_TURNS),
        ],
        {
          // An empty working directory so no repo context leaks in.
          cwd: mkdtempSync(join(tmpdir(), 'daily-check-')),
          env: process.env,
          stdio: ['pipe', 'pipe', 'pipe'],
        },
      )

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
        reject(new Error('claude -p timed out'))
      }, TIMEOUT_MS)

      child.on('error', (error) => {
        clearTimeout(timeout)
        reject(
          error.message.includes('ENOENT')
            ? new Error('claude CLI not found — is Claude Code installed?')
            : error,
        )
      })
      child.on('close', (code) => {
        clearTimeout(timeout)
        if (code !== 0) {
          reject(new Error(`claude -p exited with ${code}: ${stderr.trim()}`))
          return
        }
        resolve(stdout.trim() || 'Investigation produced no report.')
      })

      child.stdin.write(prompt)
      child.stdin.end()
    })
  }
}
