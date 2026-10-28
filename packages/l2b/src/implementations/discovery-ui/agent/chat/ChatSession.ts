import { v as z } from '@l2beat/validate'
import type { Request, Response } from 'express'
import { MCP_PATH } from '../mcp'
import type { AgentContext } from '../router'
import { ACP_PROTOCOL_VERSION, AcpConnection } from './acp'
import {
  appendToLog,
  type ChatEvent,
  type ChatStatus,
  configOptionsSchema,
  toChatEvents,
  toConfigOptions,
} from './events'
import { promptBlocks } from './prompt'
import { adapterCommand, PROVIDERS, type ProviderId } from './providers'

const KEEPALIVE_INTERVAL_MS = 15_000

const newSessionSchema = z.object({
  sessionId: z.string(),
  configOptions: z.union([configOptionsSchema, z.null()]).optional(),
})

const promptResultSchema = z.object({ stopReason: z.string() })

const configResultSchema = z.object({ configOptions: configOptionsSchema })

const sessionUpdateSchema = z.object({ update: z.unknown() })

const permissionRequestSchema = z.object({
  toolCall: z.object({
    title: z.union([z.string(), z.null()]).optional(),
  }),
  options: z.array(
    z.object({ optionId: z.string(), name: z.string(), kind: z.string() }),
  ),
})

export class ChatError extends Error {}

interface RunningAgent {
  provider: ProviderId
  connection: AcpConnection
  sessionId: string | undefined
  ready: Promise<void>
  prompted: boolean
  inTurn: boolean
  stopBeforeTurn: boolean
  failed: boolean
}

// The conversation of DiscoUI's AI panel with one agent process. Every tab
// shows the same conversation: a tab opened later replays the log.
export class ChatSession {
  private readonly log: ChatEvent[] = []
  private readonly tabs = new Set<Response>()
  private readonly permissions = new Map<
    string,
    (choice: string | undefined) => void
  >()
  private agent: RunningAgent | undefined
  private nextPermissionId = 1

  constructor(
    private readonly cwd: string,
    private readonly discoUiUrl: string,
    private readonly readContext: () => AgentContext | undefined,
  ) {}

  connect(req: Request, res: Response) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    res.write(frame({ type: 'replay', events: this.log }))
    this.tabs.add(res)
    const keepalive = setInterval(
      () => res.write(': keepalive\n\n'),
      KEEPALIVE_INTERVAL_MS,
    )
    req.on('close', () => {
      clearInterval(keepalive)
      this.tabs.delete(res)
    })
  }

  // The panel starts an agent as it opens, so its settings show before the
  // first message. Every tab does, and a tab must not restart an agent
  // another tab already started.
  start(provider: ProviderId) {
    if (this.agent !== undefined && canReuse(this.agent, provider)) {
      return
    }
    this.reset()
    const { command, args } = adapterCommand(provider)
    const agent: RunningAgent = {
      provider,
      sessionId: undefined,
      prompted: false,
      inTurn: false,
      stopBeforeTurn: false,
      failed: false,
      ready: Promise.resolve(),
      connection: new AcpConnection(
        command,
        args,
        { cwd: this.cwd, env: process.env },
        {
          onNotification: (method, params) =>
            this.onNotification(agent, method, params),
          onRequest: (method, params) => this.onRequest(agent, method, params),
          onExit: (reason) => this.onExit(agent, reason),
        },
      ),
    }
    this.agent = agent
    this.emit({ type: 'status', status: 'starting', provider })
    agent.ready = this.open(agent)
  }

  // Answers at once: the turn streams to the tabs as it goes.
  prompt(text: string) {
    const agent = this.agent
    if (agent === undefined) {
      throw new ChatError('Start a chat first')
    }
    if (agent.failed) {
      throw new ChatError('The agent did not start, start it again')
    }
    if (agent.inTurn) {
      throw new ChatError('The agent is still answering')
    }
    agent.inTurn = true
    this.emit({ type: 'user', text })
    // The question is about what was selected when it was asked, not once
    // the agent finishes starting.
    void this.runTurn(agent, text, this.readContext())
  }

  private async runTurn(
    agent: RunningAgent,
    text: string,
    context: AgentContext | undefined,
  ) {
    await agent.ready
    if (agent !== this.agent) {
      agent.inTurn = false
      return
    }
    // The tabs show the message, so they hear that it went nowhere.
    if (agent.sessionId === undefined) {
      agent.inTurn = false
      this.emit({
        type: 'error',
        message: 'The agent did not start, so the message was not sent',
      })
      return
    }
    if (agent.stopBeforeTurn) {
      agent.stopBeforeTurn = false
      agent.inTurn = false
      this.emit({ type: 'turn-end', stopReason: 'cancelled' })
      return
    }
    this.setStatus(agent, 'working')
    const prompt = promptBlocks(text, context, !agent.prompted)
    agent.prompted = true
    try {
      const result = await agent.connection.request('session/prompt', {
        sessionId: agent.sessionId,
        prompt,
      })
      const parsed = promptResultSchema.safeParse(result)
      const stopReason = parsed.success ? parsed.data.stopReason : 'end_turn'
      this.emitFor(agent, { type: 'turn-end', stopReason })
    } catch (error) {
      this.emitFor(agent, { type: 'error', message: messageOf(error) })
    } finally {
      agent.inTurn = false
      if (agent === this.agent && agent.sessionId !== undefined) {
        this.setStatus(agent, 'ready')
      }
    }
  }

  cancel() {
    const agent = this.agent
    if (agent === undefined) {
      return
    }
    if (agent.sessionId === undefined) {
      // Stopped while the agent still starts: the message is not sent.
      agent.stopBeforeTurn = agent.inTurn
      return
    }
    agent.connection.notify('session/cancel', { sessionId: agent.sessionId })
    this.cancelPermissions()
  }

  answer(id: string, choice: string): boolean {
    const resolve = this.permissions.get(id)
    resolve?.(choice)
    return resolve !== undefined
  }

  async configure(configId: string, value: string) {
    const agent = this.agent
    if (agent?.sessionId === undefined) {
      throw new ChatError('Start a chat first')
    }
    const result = await agent.connection.request('session/set_config_option', {
      sessionId: agent.sessionId,
      configId,
      value,
    })
    const parsed = configResultSchema.safeParse(result)
    if (parsed.success) {
      const options = toConfigOptions(parsed.data.configOptions)
      this.emitFor(agent, { type: 'config', options })
    }
  }

  reset() {
    this.close()
    this.log.length = 0
    this.broadcast({ type: 'replay', events: [] })
  }

  close() {
    const agent = this.agent
    this.agent = undefined
    this.cancelPermissions()
    agent?.connection.close()
  }

  private async open(agent: RunningAgent) {
    try {
      await agent.connection.request('initialize', {
        protocolVersion: ACP_PROTOCOL_VERSION,
        clientCapabilities: {
          fs: { readTextFile: false, writeTextFile: false },
          terminal: false,
        },
        clientInfo: { name: 'discoui', version: '1' },
      })
      const session = newSessionSchema.parse(
        await agent.connection.request('session/new', {
          cwd: this.cwd,
          mcpServers: [
            {
              type: 'http',
              name: 'discoui',
              url: this.discoUiUrl + MCP_PATH,
              headers: [],
            },
          ],
          // DiscoUI tools change only what the researcher sees, and every
          // view waits for them to keep it, so Claude need not ask first.
          // Older Claude Code matches the bare server name, newer the glob.
          _meta: {
            claudeCode: {
              options: { allowedTools: ['mcp__discoui', 'mcp__discoui__*'] },
            },
          },
        }),
      )
      agent.sessionId = session.sessionId
      const options = toConfigOptions(session.configOptions ?? [])
      this.emitFor(agent, { type: 'config', options })
      this.setStatus(agent, 'ready')
    } catch (error) {
      this.fail(agent, messageOf(error))
    }
  }

  private onNotification(agent: RunningAgent, method: string, params: unknown) {
    if (method !== 'session/update') {
      return
    }
    const parsed = sessionUpdateSchema.safeParse(params)
    if (parsed.success) {
      for (const event of toChatEvents(parsed.data.update)) {
        this.emitFor(agent, event)
      }
    }
  }

  private async onRequest(
    agent: RunningAgent,
    method: string,
    params: unknown,
  ): Promise<unknown> {
    if (method !== 'session/request_permission' || agent !== this.agent) {
      throw new Error('Not supported')
    }
    const request = permissionRequestSchema.parse(params)
    const id = String(this.nextPermissionId++)
    const choice = await new Promise<string | undefined>((resolve) => {
      this.permissions.set(id, resolve)
      this.emit({
        type: 'permission',
        id,
        title: request.toolCall.title ?? 'Use a tool',
        choices: request.options.map((option) => ({
          id: option.optionId,
          name: option.name,
          kind: option.kind,
        })),
      })
    })
    // A cancelled request already told the tabs, and its agent may be gone.
    if (this.permissions.delete(id)) {
      this.emitFor(agent, { type: 'permission-done', id, choice })
    }
    if (choice === undefined) {
      return { outcome: { outcome: 'cancelled' } }
    }
    return { outcome: { outcome: 'selected', optionId: choice } }
  }

  private onExit(agent: RunningAgent, reason: string) {
    if (agent === this.agent) {
      this.cancelPermissions()
      this.fail(agent, reason)
      this.agent = undefined
    }
  }

  private fail(agent: RunningAgent, reason: string) {
    agent.failed = true
    const lower = reason.toLowerCase()
    const needsSignIn = lower.includes('auth') || lower.includes('login')
    const hint = needsSignIn ? `\n${PROVIDERS[agent.provider].signIn}` : ''
    this.emitFor(agent, {
      type: 'status',
      status: 'failed',
      provider: agent.provider,
      error: `${reason}${hint}`,
    })
  }

  private setStatus(agent: RunningAgent, status: ChatStatus) {
    this.emitFor(agent, { type: 'status', status, provider: agent.provider })
  }

  private cancelPermissions() {
    for (const [id, resolve] of [...this.permissions]) {
      this.permissions.delete(id)
      this.emit({ type: 'permission-done', id, choice: undefined })
      resolve(undefined)
    }
  }

  // An agent that was replaced may still report on its way out; its events
  // belong to a conversation nobody shows anymore.
  private emitFor(agent: RunningAgent, event: ChatEvent) {
    if (agent === this.agent) {
      this.emit(event)
    }
  }

  private emit(event: ChatEvent) {
    appendToLog(this.log, event)
    this.broadcast(event)
  }

  private broadcast(event: object) {
    for (const tab of this.tabs) {
      tab.write(frame(event))
    }
  }
}

// Tabs start the agent on their own, and one tab's start can arrive after
// another tab prompted it, so only a failure or another provider replaces
// it. Reset is the way to start over.
function canReuse(agent: RunningAgent, provider: ProviderId): boolean {
  return agent.provider === provider && !agent.failed
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed'
}

function frame(event: object): string {
  return `data: ${JSON.stringify(event)}\n\n`
}
