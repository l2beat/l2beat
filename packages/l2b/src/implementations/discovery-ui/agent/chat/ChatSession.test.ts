import { expect } from 'earl'
import type { ApiAgentEvent, ApiChatEvent } from '../../types'
import { AgentTabs, type TabStream } from '../tabs'
import { ChatError, ChatSession } from './ChatSession'

// A fake ACP agent, run as a node process: it answers a prompt with two
// text chunks and a tool call, asks permission for it, and finishes the turn
// once answered.
const FAKE_AGENT = `
const lines = require('readline').createInterface({ input: process.stdin })
const send = (message) => process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...message }) + '\\n')
const update = (update) => send({ method: 'session/update', params: { sessionId: 's1', update } })
let promptId
lines.on('line', (line) => {
  const message = JSON.parse(line)
  if (message.method === 'initialize') send({ id: message.id, result: { protocolVersion: 1 } })
  if (message.method === 'session/new') send({ id: message.id, result: { sessionId: 's1' } })
  if (message.method === 'session/prompt') {
    promptId = message.id
    update({ sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'Hel' } })
    update({ sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'lo' } })
    update({ sessionUpdate: 'tool_call', toolCallId: 't1', title: 'Run ls', status: 'pending' })
    send({ id: 99, method: 'session/request_permission', params: { toolCall: { title: 'Run ls', kind: 'execute', locations: [{ path: '/repo' }], rawInput: { command: 'ls' } }, options: [{ optionId: 'allow', name: 'Allow', kind: 'allow_once' }] } })
  }
  if (message.id === 99 && message.method === undefined) {
    update({ sessionUpdate: 'tool_call_update', toolCallId: 't1', status: 'completed' })
    send({ id: promptId, result: { stopReason: 'end_turn' } })
  }
})
`

describe(ChatSession.name, () => {
  const sessions: ChatSession[] = []
  afterEach(() => {
    for (const session of sessions.splice(0)) session.close()
  })

  function setup(script = FAKE_AGENT) {
    const tabs = new AgentTabs()
    const owner = stream()
    const other = stream()
    tabs.connect('owner', owner)
    tabs.connect('other', other)
    const chat = new ChatSession(tabs, {
      cwd: process.cwd(),
      mcpUrl: 'http://localhost:0/api/agent/mcp',
      launch: () => ({ command: process.execPath, args: ['-e', script] }),
    })
    sessions.push(chat)
    return { tabs, chat, owner, other }
  }

  it('runs a turn in the tab that owns the chat, and only there', async () => {
    const { chat, owner, other } = setup()
    chat.start('owner', 'claude')
    await waitFor(() => statuses(owner).includes('ready'))
    chat.prompt('owner', 'List files')
    const permission = await waitFor(() =>
      chatEvents(owner).find((e) => e.type === 'permission'),
    )
    chat.answerPermission('owner', permission.id, 'allow')
    await waitFor(() => chatEvents(owner).some((e) => e.type === 'turn-end'))

    const texts = chatEvents(owner).filter((e) => e.type === 'text')
    expect(texts.map((e) => e.text).join('')).toEqual('Hello')
    expect(chatEvents(owner).filter((e) => e.type === 'tool')).toEqual([
      { type: 'tool', id: 't1', title: 'Run ls', status: 'pending' },
      { type: 'tool', id: 't1', status: 'completed' },
    ])
    expect(other.written).toEqual([])
  })

  it('refuses a second tab while the owner is open, then hands it over', async () => {
    const { tabs, chat, owner } = setup()
    chat.start('owner', 'claude')
    expect(() => chat.start('other', 'codex')).toThrow(ChatError)
    expect(() => chat.prompt('other', 'Hi')).toThrow(ChatError)
    tabs.disconnect('owner', owner)
    chat.start('other', 'codex')
    expect(() => chat.prompt('owner', 'Hi')).toThrow(ChatError)
  })

  it('replays the merged transcript to its tab after a reload', async () => {
    const { tabs, chat, owner } = setup()
    chat.start('owner', 'claude')
    await waitFor(() => statuses(owner).includes('ready'))
    chat.prompt('owner', 'List files')
    await waitFor(() => chatEvents(owner).some((e) => e.type === 'permission'))
    const stranger = stream()
    tabs.connect('stranger', stranger)
    // A tab without the chat learns it has none.
    expect(parse(stranger)).toEqual([{ type: 'chat-replay', events: [] }])
    const reloaded = stream()
    tabs.connect('owner', reloaded)
    const replay = parse(reloaded).find((e) => e.type === 'chat-replay')
    expect(replay?.type === 'chat-replay' && replay.events).toEqual([
      { type: 'user', text: 'List files' },
      { type: 'status', status: 'working', provider: 'claude' },
      { type: 'text', text: 'Hello' },
      { type: 'tool', id: 't1', title: 'Run ls', status: 'pending' },
      {
        type: 'permission',
        id: '1',
        title: 'Run ls',
        // What the researcher approves, beyond the agent's own title.
        kind: 'execute',
        paths: ['/repo'],
        input: JSON.stringify({ command: 'ls' }, null, 2),
        options: [{ id: 'allow', name: 'Allow', kind: 'allow_once' }],
      },
    ])
  })

  it('drops a prompt stopped while the agent still starts', async () => {
    // The agent answers initialize late, after the prompt was stopped.
    const slow = FAKE_AGENT.replace(
      "if (message.method === 'initialize') send(",
      "if (message.method === 'initialize') setTimeout(() => send(",
    ).replace(
      'result: { protocolVersion: 1 } })',
      'result: { protocolVersion: 1 } }), 200)',
    )
    const { chat, owner } = setup(slow)
    chat.start('owner', 'claude')
    chat.prompt('owner', 'List files')
    chat.cancel('owner')
    const end = await waitFor(() =>
      chatEvents(owner).find((e) => e.type === 'turn-end'),
    )
    expect(end).toEqual({ type: 'turn-end', stopReason: 'cancelled' })
    expect(chatEvents(owner).some((e) => e.type === 'text')).toEqual(false)
  })

  it('shows the details of a call that asks permission with its id alone', async () => {
    // The details come in the tool call; the request names only its id.
    const sparse = FAKE_AGENT.replace(
      "update({ sessionUpdate: 'tool_call', toolCallId: 't1', title: 'Run ls', status: 'pending' })",
      "update({ sessionUpdate: 'tool_call', toolCallId: 't1', title: 'Run ls', status: 'pending', kind: 'execute', rawInput: { command: 'ls' } })",
    ).replace(
      "toolCall: { title: 'Run ls', kind: 'execute', locations: [{ path: '/repo' }], rawInput: { command: 'ls' } }",
      "toolCall: { toolCallId: 't1' }",
    )
    const { chat, owner } = setup(sparse)
    chat.start('owner', 'claude')
    await waitFor(() => statuses(owner).includes('ready'))
    chat.prompt('owner', 'List files')
    const permission = await waitFor(() =>
      chatEvents(owner).find((e) => e.type === 'permission'),
    )
    expect(permission).toEqual({
      type: 'permission',
      id: '1',
      title: 'Run ls',
      kind: 'execute',
      paths: [],
      input: JSON.stringify({ command: 'ls' }, null, 2),
      options: [{ id: 'allow', name: 'Allow', kind: 'allow_once' }],
    })
  })

  it('refuses a prompt while the agent answers', async () => {
    const { chat, owner } = setup()
    chat.start('owner', 'claude')
    chat.prompt('owner', 'One')
    expect(() => chat.prompt('owner', 'Two')).toThrow(
      'The agent is still answering',
    )
    await waitFor(() => chatEvents(owner).some((e) => e.type === 'permission'))
  })

  it('stops an agent that speaks another ACP version', async () => {
    const newer = FAKE_AGENT.replace(
      'result: { protocolVersion: 1 }',
      'result: { protocolVersion: 2 }',
    )
    const { chat, owner } = setup(newer)
    chat.start('owner', 'claude')
    const failed = await waitFor(() =>
      chatEvents(owner).find(
        (e) => e.type === 'status' && e.status === 'failed',
      ),
    )
    const error = failed.type === 'status' ? failed.error : undefined
    expect(error ?? '').toInclude('another ACP version')
  })

  it('reports an agent that exits', async () => {
    const { chat, owner } = setup('process.exit(3)')
    chat.start('owner', 'codex')
    const failed = await waitFor(() =>
      chatEvents(owner).find(
        (e) => e.type === 'status' && e.status === 'failed',
      ),
    )
    const error = failed.type === 'status' ? failed.error : undefined
    expect(error ?? '').toInclude('code 3')
    expect(() => chat.prompt('owner', 'Hi')).toThrow(
      'The agent stopped, start a new chat',
    )
  })
})

// Every tab gets a board replay as it connects, which the chat leaves alone.
function stream(): TabStream & { written: string[] } {
  const result = {
    written: [] as string[],
    write: (chunk: string) => {
      if (!chunk.includes('"board-replay"')) result.written.push(chunk)
    },
    end: () => {},
  }
  return result
}

function parse(tab: { written: string[] }): ApiAgentEvent[] {
  return tab.written.map((chunk) => JSON.parse(chunk.slice('data: '.length)))
}

function chatEvents(tab: { written: string[] }): ApiChatEvent[] {
  return parse(tab).flatMap((e) => (e.type === 'chat' ? [e.event] : []))
}

function statuses(tab: { written: string[] }): string[] {
  return chatEvents(tab).flatMap((e) => (e.type === 'status' ? [e.status] : []))
}

async function waitFor<T>(find: () => T | undefined | false): Promise<T> {
  for (let attempt = 0; attempt < 100; attempt++) {
    const found = find()
    if (found !== undefined && found !== false) {
      return found
    }
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  throw new Error('Timed out waiting for the chat')
}
