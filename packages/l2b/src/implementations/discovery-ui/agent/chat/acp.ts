import { v as z } from '@l2beat/validate'
import { type ChildProcess, spawn } from 'child_process'

export const ACP_PROTOCOL_VERSION = 1
const STDERR_LINES_MAX = 20

const messageSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  method: z.string().optional(),
  params: z.unknown().optional(),
  result: z.unknown().optional(),
  error: z
    .object({ code: z.number(), message: z.string(), data: z.unknown() })
    .optional(),
})
type Message = z.infer<typeof messageSchema>

export class AcpError extends Error {}

export interface AcpHandlers {
  onNotification: (method: string, params: unknown) => void
  // The agent asks the client, for example for permission to run a tool.
  onRequest: (method: string, params: unknown) => Promise<unknown>
  onExit: (reason: string) => void
}

interface Waiter {
  resolve: (result: unknown) => void
  reject: (error: Error) => void
}

// One agent process speaking the Agent Client Protocol: newline separated
// JSON-RPC messages over its stdin and stdout.
export class AcpConnection {
  private readonly child: ChildProcess
  private readonly waiters = new Map<number, Waiter>()
  private readonly stderr: string[] = []
  private nextId = 1
  private buffered = ''
  private exited: string | undefined

  constructor(
    command: string,
    args: string[],
    options: { cwd: string; env: NodeJS.ProcessEnv },
    private readonly handlers: AcpHandlers,
  ) {
    this.child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env,
      stdio: ['pipe', 'pipe', 'pipe'],
      // Windows installs npx as npx.cmd, which only a shell runs.
      shell: process.platform === 'win32',
    })
    this.child.stdout?.setEncoding('utf8')
    this.child.stdout?.on('data', (chunk: string) => this.read(chunk))
    this.child.stderr?.setEncoding('utf8')
    this.child.stderr?.on('data', (chunk: string) => this.keepStderr(chunk))
    // Writing to an agent that just died fails with EPIPE after the fact.
    this.child.stdin?.on('error', () => this.exit('stopped reading'))
    this.child.on('error', (error) => this.exit(error.message))
    this.child.on('exit', (code, signal) =>
      this.exit(`exited with ${signal ?? `code ${code}`}`),
    )
  }

  request(method: string, params: unknown): Promise<unknown> {
    if (this.exited !== undefined) {
      return Promise.reject(new AcpError(this.describeExit(this.exited)))
    }
    const id = this.nextId++
    this.write({ jsonrpc: '2.0', id, method, params })
    return new Promise((resolve, reject) =>
      this.waiters.set(id, { resolve, reject }),
    )
  }

  notify(method: string, params: unknown) {
    if (this.exited === undefined) {
      this.write({ jsonrpc: '2.0', method, params })
    }
  }

  // Answers still owed to the agent, like a cancelled permission, settle
  // after this and are dropped.
  close() {
    this.exit('was closed')
    this.child.stdin?.end()
    this.child.kill('SIGTERM')
  }

  private write(message: object) {
    if (this.exited === undefined && this.child.stdin?.writable === true) {
      this.child.stdin.write(`${JSON.stringify(message)}\n`)
    }
  }

  private read(chunk: string) {
    this.buffered += chunk
    let end = this.buffered.indexOf('\n')
    while (end !== -1) {
      const line = this.buffered.slice(0, end).trim()
      this.buffered = this.buffered.slice(end + 1)
      if (line.length > 0) {
        this.dispatch(line)
      }
      end = this.buffered.indexOf('\n')
    }
  }

  private dispatch(line: string) {
    let json: unknown
    try {
      json = JSON.parse(line)
    } catch {
      this.keepStderr(line)
      return
    }
    const parsed = messageSchema.safeParse(json)
    if (!parsed.success) {
      this.keepStderr(line)
      return
    }
    const message = parsed.data
    if (message.method === undefined) {
      this.settle(message)
    } else if (message.id === undefined) {
      this.handlers.onNotification(message.method, message.params)
    } else {
      void this.answer(message.id, message.method, message.params)
    }
  }

  private settle(message: Message) {
    if (typeof message.id !== 'number') {
      return
    }
    const waiter = this.waiters.get(message.id)
    this.waiters.delete(message.id)
    if (message.error !== undefined) {
      waiter?.reject(new AcpError(message.error.message))
    } else {
      waiter?.resolve(message.result)
    }
  }

  private async answer(id: number | string, method: string, params: unknown) {
    try {
      const result = await this.handlers.onRequest(method, params)
      this.write({ jsonrpc: '2.0', id, result })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed'
      this.write({ jsonrpc: '2.0', id, error: { code: -32603, message } })
    }
  }

  private keepStderr(text: string) {
    for (const line of text.split('\n')) {
      if (line.trim().length > 0) {
        this.stderr.push(line)
      }
    }
    this.stderr.splice(0, Math.max(0, this.stderr.length - STDERR_LINES_MAX))
  }

  private exit(reason: string) {
    if (this.exited !== undefined) {
      return
    }
    this.exited = reason
    const error = new AcpError(this.describeExit(reason))
    for (const waiter of this.waiters.values()) {
      waiter.reject(error)
    }
    this.waiters.clear()
    this.handlers.onExit(error.message)
  }

  private describeExit(reason: string): string {
    const tail = this.stderr.slice(-3).join('\n')
    return tail.length > 0 ? `Agent ${reason}:\n${tail}` : `Agent ${reason}`
  }
}
