import { spawn } from 'child_process'
import { Response } from 'express'

function sendSSE(res: Response, data: string) {
  const sanitizedData = data.replace(/\n/g, '\\n')
  res.write(`data: ${sanitizedData}\n\n`)
}

export function executeTerminalCommand(command: string, res: Response): void {
  const process = spawn(command, { shell: true })

  process.stdout.on('data', (data) => {
    const text = data.toString()
    sendSSE(res, text)
  })

  process.stderr.on('data', (data) => {
    const text = data.toString()
    sendSSE(res, text)
  })

  process.on('close', (code) => {
    sendSSE(res, `Process exited with code ${code}\n`)
    res.end()
  })

  process.on('error', (err) => {
    sendSSE(res, `Error: ${err.message}\n`)
    res.end()
  })

  res.on('close', () => {
    process.kill()
  })
}
