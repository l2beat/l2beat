import { spawn } from 'child_process'
import { Response } from 'express'

function sendSSE(res: Response, data: string) {
  const sanitizedData = data.replace(/\n/g, '\\n')
  res.write(`data: ${sanitizedData}\n\n`)
}

export function executeTerminalCommand(command: string, res: Response): void {
  const proc = spawn(command, {
    shell: true,
    env: {
      ...process.env,
      TERM: 'screen-256color',
      FORCE_COLOR: '1',
    },
  })

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
    proc.kill()
  })
}
