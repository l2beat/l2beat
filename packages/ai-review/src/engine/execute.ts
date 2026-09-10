import { spawn } from 'node:child_process'

export interface ExecuteOptions {
  cwd: string
  stdin: string
  timeoutMs: number
}

export interface ExecuteResult {
  stdout: string
  stderr: string
  timedOut: boolean
  code: number | null
}

export type Execute = typeof execute

/** How long after a timeout kill to keep waiting for 'close' before resolving anyway. */
const KILL_GRACE_MS = 1_000

/** Runs a child in its own process group; on timeout the whole group is killed. */
export function execute(
  binary: string,
  args: string[],
  options: ExecuteOptions,
): Promise<ExecuteResult> {
  return new Promise((resolve) => {
    const child = spawn(binary, args, {
      cwd: options.cwd,
      stdio: ['pipe', 'pipe', 'pipe'],
      detached: true,
    })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let settled = false
    const finish = (code: number | null) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      // A grandchild that escaped the group keeps inherited pipes open; drop
      // our ends so it cannot hold the event loop after we have resolved.
      child.stdin.destroy()
      child.stdout.destroy()
      child.stderr.destroy()
      resolve({ stdout, stderr, timedOut, code })
    }
    const timer = setTimeout(() => {
      if (settled) return
      timedOut = true
      killGroup(child.pid)
      // 'close' waits on stdio, which a grandchild outside the killed group
      // may still hold open — do not let that outlive the timeout.
      setTimeout(() => finish(null), KILL_GRACE_MS).unref()
    }, options.timeoutMs)
    // Settle on 'error' too; whether 'close' follows a spawn failure is Node-version dependent.
    child.on('error', (err) => {
      stderr += String(err)
      finish(null)
    })
    // The child may exit before reading stdin; EPIPE must not crash us.
    child.stdin.on('error', (err) => {
      stderr += `stdin: ${String(err)}\n`
    })
    child.stdout.on('data', (d) => {
      stdout += d
    })
    child.stderr.on('data', (d) => {
      stderr += d
      process.stderr.write(d)
    })
    child.on('close', finish)
    child.stdin.end(options.stdin)
  })
}

function killGroup(pid: number | undefined) {
  if (pid === undefined) return
  try {
    process.kill(-pid, 'SIGKILL')
  } catch {
    try {
      process.kill(pid, 'SIGKILL')
    } catch {
      // already gone
    }
  }
}
