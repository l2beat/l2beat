import { v as z } from '@l2beat/validate'
import type { ApiChatEvent, ApiChatProvider } from '../../types'
import type { AgentTabs } from '../tabs'
import { ACP_PROTOCOL_VERSION, AcpConnection } from './acp'
import { appendToLog, toChatEvents } from './events'
import { signInHint } from './providers'

const newSessionSchema = z.object({ sessionId: z.string() })
const promptResultSchema = z.object({ stopReason: z.string() })
const sessionUpdateSchema = z.object({ update: z.unknown() })
const permissionRequestSchema = z.object({
  toolCall: z.object({ title: z.union([z.string(), z.null()]).optional() }),
  options: z.array(
    z.object({ optionId: z.string(), name: z.string(), kind: z.string() }),
  ),
})

// A request the chat cannot take, like a prompt while the agent answers.
export class ChatError extends Error {}

export interface ChatOptions {
  // Where the agent works: the discovery root, so it finds the projects and
  // the repository's agent instructions.
  cwd: string
  mcpUrl: string
  launch: (provider: ApiChatProvider) => { command: string; args: string[] }
}

interface RunningChat {
  // Only this tab sees and drives the conversation.
  owner: string
  provider: ApiChatProvider
  connection: AcpConnection
  sessionId: string | undefined
  ready: Promise<void>
  isInTurn: boolean
  // Stopped before the agent started, so the prompt must not go out.
  isCancelledBeforeSend: boolean
  hasFailed: boolean
  log: ApiChatEvent[]
  permissions: Map<string, (optionId: string | undefined) => void>
}

// DiscoUI's one chat with a coding agent, run as an ACP adapter process.
export class ChatSession {
  private chat: RunningChat | undefined
  private permissionCount = 0

  constructor(
    private readonly tabs: AgentTabs,
    private readonly options: ChatOptions,
  ) {
    // A reload reconnects the tab, which then needs the whole transcript.
    tabs.onConnect((id) => {
      const chat = this.chat
      if (chat?.owner === id) {
        tabs.sendChat(id, { type: 'chat-replay', events: chat.log })
      }
    })
  }

  // A tab takes over a chat only from a tab that closed.
  start(tab: string, provider: ApiChatProvider) {
    const current = this.chat
    if (current !== undefined && current.owner !== tab) {
      if (this.tabs.isConnected(current.owner)) {
        throw new ChatError('The chat is open in another DiscoUI tab')
      }
    }
    this.close()
    const { command, args } = this.options.launch(provider)
    const chat: RunningChat = {
      owner: tab,
      provider,
      sessionId: undefined,
      ready: Promise.resolve(),
      isInTurn: false,
      isCancelledBeforeSend: false,
      hasFailed: false,
      log: [],
      permissions: new Map(),
      connection: new AcpConnection(
        command,
        args,
        { cwd: this.options.cwd, env: process.env },
        {
          onNotification: (method, params) =>
            this.onNotification(chat, method, params),
          onRequest: (method, params) => this.onRequest(chat, method, params),
          onExit: (reason) => this.fail(chat, reason),
        },
      ),
    }
    this.chat = chat
    this.tabs.sendChat(tab, { type: 'chat-replay', events: [] })
    this.emit(chat, { type: 'status', status: 'starting', provider })
    chat.ready = this.open(chat)
  }

  // Answers at once: the turn streams to the tab as it goes.
  prompt(tab: string, text: string) {
    const chat = this.owned(tab)
    if (chat.hasFailed) {
      throw new ChatError('The agent stopped, start a new chat')
    }
    if (chat.isInTurn) {
      throw new ChatError('The agent is still answering')
    }
    chat.isInTurn = true
    this.emit(chat, { type: 'user', text })
    void this.runTurn(chat, text)
  }

  cancel(tab: string) {
    const chat = this.owned(tab)
    if (chat.sessionId === undefined) {
      chat.isCancelledBeforeSend = chat.isInTurn
    } else {
      chat.connection.notify('session/cancel', { sessionId: chat.sessionId })
    }
    this.cancelPermissions(chat)
  }

  answerPermission(tab: string, id: string, optionId: string) {
    const resolve = this.owned(tab).permissions.get(id)
    if (resolve === undefined) {
      throw new ChatError('The agent no longer asks this')
    }
    resolve(optionId)
  }

  closeFor(tab: string) {
    this.owned(tab)
    this.close()
  }

  // On shutdown too: the adapter would outlive the server otherwise.
  close() {
    const chat = this.chat
    if (chat === undefined) {
      return
    }
    this.chat = undefined
    this.cancelPermissions(chat)
    chat.connection.close()
    const provider = chat.provider
    this.tabs.sendChat(chat.owner, {
      type: 'chat',
      event: { type: 'status', status: 'closed', provider },
    })
  }

  private owned(tab: string): RunningChat {
    const chat = this.chat
    if (chat === undefined || chat.owner !== tab) {
      throw new ChatError('This tab has no chat, start one')
    }
    return chat
  }

  private async open(chat: RunningChat) {
    try {
      await chat.connection.request('initialize', {
        protocolVersion: ACP_PROTOCOL_VERSION,
        clientCapabilities: {
          fs: { readTextFile: false, writeTextFile: false },
          terminal: false,
        },
        clientInfo: { name: 'discoui', version: '1' },
      })
      const session = newSessionSchema.parse(
        await chat.connection.request('session/new', {
          cwd: this.options.cwd,
          mcpServers: [
            {
              type: 'http',
              name: 'discoui',
              url: this.options.mcpUrl,
              headers: [],
            },
          ],
          // DiscoUI's tools change only what the researcher sees, so Claude
          // need not ask before each. Older Claude Code matches the bare
          // server name, newer the glob.
          _meta: {
            claudeCode: {
              options: { allowedTools: ['mcp__discoui', 'mcp__discoui__*'] },
            },
          },
        }),
      )
      chat.sessionId = session.sessionId
      this.setStatus(chat, 'ready')
    } catch (error) {
      this.fail(chat, messageOf(error))
    }
  }

  private async runTurn(chat: RunningChat, text: string) {
    await chat.ready
    try {
      if (chat.sessionId === undefined) {
        throw new ChatError('The agent did not start, the message was not sent')
      }
      if (chat.isCancelledBeforeSend) {
        chat.isCancelledBeforeSend = false
        this.emit(chat, { type: 'turn-end', stopReason: 'cancelled' })
        return
      }
      this.setStatus(chat, 'working')
      const result = await chat.connection.request('session/prompt', {
        sessionId: chat.sessionId,
        prompt: [{ type: 'text', text }],
      })
      const parsed = promptResultSchema.safeParse(result)
      const stopReason = parsed.success ? parsed.data.stopReason : 'end_turn'
      this.emit(chat, { type: 'turn-end', stopReason })
    } catch (error) {
      this.emit(chat, { type: 'error', message: messageOf(error) })
    } finally {
      chat.isInTurn = false
      if (!chat.hasFailed) {
        this.setStatus(chat, 'ready')
      }
    }
  }

  private onNotification(chat: RunningChat, method: string, params: unknown) {
    if (method !== 'session/update') {
      return
    }
    const parsed = sessionUpdateSchema.safeParse(params)
    if (parsed.success) {
      for (const event of toChatEvents(parsed.data.update)) {
        this.emit(chat, event)
      }
    }
  }

  // The researcher answers in the panel, however long that takes; closing
  // or cancelling the chat answers for them.
  private async onRequest(
    chat: RunningChat,
    method: string,
    params: unknown,
  ): Promise<unknown> {
    if (method !== 'session/request_permission') {
      throw new Error('Not supported')
    }
    const request = permissionRequestSchema.parse(params)
    this.permissionCount++
    const id = String(this.permissionCount)
    const optionId = await new Promise<string | undefined>((resolve) => {
      chat.permissions.set(id, resolve)
      this.emit(chat, {
        type: 'permission',
        id,
        title: request.toolCall.title ?? 'Use a tool',
        options: request.options.map((option) => ({
          id: option.optionId,
          name: option.name,
          kind: option.kind,
        })),
      })
    })
    chat.permissions.delete(id)
    this.emit(chat, { type: 'permission-done', id })
    return optionId === undefined
      ? { outcome: { outcome: 'cancelled' } }
      : { outcome: { outcome: 'selected', optionId } }
  }

  private fail(chat: RunningChat, reason: string) {
    if (chat.hasFailed) {
      return
    }
    chat.hasFailed = true
    this.cancelPermissions(chat)
    const lower = reason.toLowerCase()
    const needsSignIn = lower.includes('auth') || lower.includes('login')
    const error = needsSignIn
      ? `${reason}\n${signInHint(chat.provider)}`
      : reason
    this.emit(chat, {
      type: 'status',
      status: 'failed',
      provider: chat.provider,
      error,
    })
  }

  private setStatus(chat: RunningChat, status: 'ready' | 'working') {
    this.emit(chat, { type: 'status', status, provider: chat.provider })
  }

  private cancelPermissions(chat: RunningChat) {
    for (const resolve of [...chat.permissions.values()]) {
      resolve(undefined)
    }
  }

  // A chat that was replaced may still report on its way out; nobody shows
  // its conversation anymore.
  private emit(chat: RunningChat, event: ApiChatEvent) {
    if (chat !== this.chat) {
      return
    }
    appendToLog(chat.log, event)
    this.tabs.sendChat(chat.owner, { type: 'chat', event })
  }
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed'
}
