/**
 * One model turn is one child process: prompt in on stdin, JSONL out on
 * stdout, killed as a group on timeout so a CLI that spawned helpers does
 * not outlive the turn. Shared by every CLI-backed `ModelClient`.
 *
 * The group of its own is also why a turn would outlive discovery: a run
 * stopped by a failed templatization exits while another contract's turn
 * may still be thinking, on the user's quota. So every running child is
 * killed when the process exits, however it exits.
 */
import { type ChildProcess, spawn } from 'child_process'

export interface ProcessRun {
  stdout: string
  stderr: string
  exitCode: number | null
  timedOut: boolean
  timeoutMs: number
}

/**
 * Spawns in its own process group so a timeout kills the CLI and whatever it
 * spawned, not just the front process.
 */
export function runProcess(
  binary: string,
  args: string[],
  stdin: string,
  cwd: string,
  env: NodeJS.ProcessEnv,
  timeoutMs: number,
): Promise<ProcessRun> {
  return new Promise((resolve, reject) => {
    let child: ChildProcess
    try {
      child = spawn(binary, args, {
        cwd,
        env,
        detached: true,
        stdio: ['pipe', 'pipe', 'pipe'],
      })
    } catch (error) {
      reject(error)
      return
    }
    killOnExit(child)
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      killGroup(child)
    }, timeoutMs)

    child.stdout?.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr?.on('data', (chunk: Buffer) => stderr.push(chunk))
    child.on('error', (error) => {
      clearTimeout(timer)
      running.delete(child)
      reject(
        new Error(`could not run ${binary}: ${error.message}`, {
          cause: error,
        }),
      )
    })
    child.on('close', (exitCode) => {
      clearTimeout(timer)
      running.delete(child)
      resolve({
        stdout: Buffer.concat(stdout).toString('utf8'),
        stderr: Buffer.concat(stderr).toString('utf8'),
        exitCode,
        timedOut,
        timeoutMs,
      })
    })
    // A process that dies before reading its stdin raises EPIPE here; the
    // exit code and stderr already tell that story, so the write error adds nothing.
    child.stdin?.on('error', () => undefined)
    child.stdin?.end(stdin)
  })
}

const running = new Set<ChildProcess>()
let exitHookInstalled = false

function killOnExit(child: ChildProcess): void {
  running.add(child)
  if (!exitHookInstalled) {
    exitHookInstalled = true
    process.once('exit', () => {
      for (const child of running) {
        killGroup(child)
      }
    })
  }
}

function killGroup(child: ChildProcess): void {
  if (child.pid === undefined) {
    return
  }
  try {
    process.kill(-child.pid, 'SIGKILL')
  } catch {
    child.kill('SIGKILL')
  }
}
