import { spawn } from 'child_process'
import { Response } from 'express'

export function executeTerminalCommand(command: string, res: Response): void {
  const [cmd, ...args] = command.split(' ')
  const process = spawn(cmd, args)

  process.stdout.on('data', (data) => {
    res.write(data.toString())
  })

  process.stderr.on('data', (data) => {
    res.write(data.toString())
  })

  process.on('close', (code) => {
    res.write(`Process exited with code ${code}\n`)
    res.end()
  })

  process.on('error', (err) => {
    res.write(`Error: ${err.message}\n`)
    res.end()
  })

  // Handle client disconnect
  res.on('close', () => {
    process.kill()
  })
}
