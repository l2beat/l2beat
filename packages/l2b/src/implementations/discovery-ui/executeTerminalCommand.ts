import { spawn } from 'child_process'
import type { Response } from 'express'

function sendSSE(res: Response, data: string) {
  const sanitizedData = data.replace(/\n/g, '\\n')
  res.write(`data: ${sanitizedData}\n\n`)
}

// Windows has no process groups, and detaching opens a separate console.
const USE_PROCESS_GROUP = process.platform !== 'win32'

export function executeTerminalCommand(command: string, res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const proc = spawn(command, {
    shell: true,
    detached: USE_PROCESS_GROUP,
    env: {
      ...process.env,
      TERM: 'screen-256color',
      FORCE_COLOR: '1',
    },
  })

  sendSSE(res, `Running command: ${command}\n`)

  proc.stdout.on('data', (data) => {
    const text = data.toString()
    sendSSE(res, text)
  })

  proc.stderr.on('data', (data) => {
    const text = data.toString()
    sendSSE(res, text)
  })

  proc.on('close', (code) => {
    sendSSE(res, `Process exited with code ${code}\n`)
    res.end()
  })

  proc.on('error', (err) => {
    sendSSE(res, `Error: ${err.message}\n`)
    res.end()
  })

  res.on('close', () => {
    if (proc.pid === undefined || proc.exitCode !== null) {
      return
    }
    if (!USE_PROCESS_GROUP) {
      proc.kill()
      return
    }
    try {
      process.kill(-proc.pid, 'SIGTERM')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') {
        throw error
      }
    }
  })
}
