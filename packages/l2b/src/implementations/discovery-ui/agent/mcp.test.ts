import type { ConfigReader, DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import type { Server } from 'http'
import type { AddressInfo } from 'net'
import { attachMcpRoutes } from './mcp'
import { createAgentRouter } from './router'
import { AgentTabs, type TabStream } from './tabs'

// Every tab gets its chat's and its board's replay as it connects; these
// tests look at the rest.
function keep(chunk: string): boolean {
  return !chunk.includes('"chat-replay"') && !chunk.includes('"board-replay"')
}

const BRIDGE = ChainSpecificAddress(
  'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
)
const INBOX = ChainSpecificAddress(
  'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
)
// The routes read only the entries' addresses and names.
const DISCOVERY = {
  entries: [
    { type: 'Contract', address: BRIDGE, name: 'Bridge' },
    { type: 'Contract', address: INBOX, name: 'Inbox' },
  ],
} as unknown as DiscoveryOutput

// A real HTTP round trip against the express app, the way an agent's MCP
// client calls it.
describe(attachMcpRoutes.name, () => {
  const tabs = new AgentTabs()
  let url = ''
  let server: Server

  before(async () => {
    const app = express()
    // Like ConfigReader, it throws for a project it cannot find.
    const configReader = mockObject<ConfigReader>({
      hasDiscovery: (project: string) => {
        if (project === 'missing') throw new Error('Project not found')
        return project === 'linea'
      },
      readDiscoveryWithReferences: () => [DISCOVERY],
    })
    const chatOptions = {
      cwd: process.cwd(),
      mcpUrl: 'http://localhost:0/api/agent/mcp',
      launch: () => ({ command: process.execPath, args: ['-e', ''] }),
    }
    app.use('/api/agent', createAgentRouter(configReader, chatOptions, tabs))
    // Express logs the errors it answers itself, like a body over the limit.
    app.use(
      (
        error: { status?: number },
        _req: Request,
        res: Response,
        _next: NextFunction,
      ) => {
        res.status(error.status ?? 500).end()
      },
    )
    server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    const { port } = server.address() as AddressInfo
    url = `http://127.0.0.1:${port}/api/agent/mcp`
  })

  after(() => server.close())

  async function call(method: string, params?: object) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
    })
    return (await response.json()) as {
      result?: Record<string, unknown>
      error?: { code: number }
    }
  }

  it('agrees on a protocol version it knows', async () => {
    const known = await call('initialize', { protocolVersion: '2025-06-18' })
    expect(known.result?.protocolVersion).toEqual('2025-06-18')
    expect(known.result?.instructions).toBeA(String)
    const unknown = await call('initialize', { protocolVersion: '2099-01-01' })
    expect(unknown.result?.protocolVersion).toEqual('2025-11-25')
  })

  it('lists the tools with object schemas, loaded up front', async () => {
    const tools = (await call('tools/list')).result?.tools as {
      name: string
      inputSchema: { type: string; $schema?: string }
      _meta: object
    }[]
    expect(tools.map((t) => t.name)).toEqual([
      'show',
      'context',
      'permissions',
      'board',
      'graph',
      'layout',
      'clear',
    ])
    for (const tool of tools) {
      expect(tool.inputSchema.type).toEqual('object')
      expect(tool.inputSchema.$schema).toEqual(undefined)
      expect(tool._meta).toEqual({ 'anthropic/alwaysLoad': true })
    }
  })

  it('fails show while no tab is open', async () => {
    const result = (
      await call('tools/call', {
        name: 'show',
        arguments: { steps: [{ note: 'Hi' }] },
      })
    ).result
    expect(result?.isError).toEqual(true)
    expect(JSON.stringify(result?.content)).toInclude('DiscoUI has no open tab')
  })

  it('names the argument a call got wrong', async () => {
    const result = (
      await call('tools/call', { name: 'show', arguments: { steps: [] } })
    ).result
    expect(result?.isError).toEqual(true)
    expect(JSON.stringify(result?.content)).toInclude('Between 1 and 30 steps')
  })

  it('sends clear to the active tab', async () => {
    const written: string[] = []
    const stream: TabStream = {
      write: (c) => keep(c) && written.push(c),
      end: () => {},
    }
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: undefined, focusedAt: 1, sequence: 1 })
    const result = (await call('tools/call', { name: 'clear' })).result
    tabs.disconnect('tab-1', stream)
    expect(result?.isError).toEqual(false)
    expect(written).toEqual(['data: {"type":"clear"}\n\n'])
  })

  it("shows in the chat's tab when the agent names it", async () => {
    const chatTab: string[] = []
    const focused: string[] = []
    const chatStream: TabStream = {
      write: (c) => keep(c) && chatTab.push(c),
      end: () => {},
    }
    const focusedStream: TabStream = {
      write: (c) => keep(c) && focused.push(c),
      end: () => {},
    }
    tabs.connect('chat-tab', chatStream)
    tabs.connect('focused-tab', focusedStream)
    tabs.report('chat-tab', { project: 'linea', focusedAt: 10, sequence: 10 })
    tabs.report('focused-tab', {
      project: 'arbitrum',
      focusedAt: 20,
      sequence: 11,
    })
    const response = await fetch(`${url}?tab=chat-tab`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: { name: 'show', arguments: { steps: [{ note: 'Hi' }] } },
      }),
    })
    const body = (await response.json()) as { result?: { isError: boolean } }
    tabs.disconnect('chat-tab', chatStream)
    tabs.disconnect('focused-tab', focusedStream)
    expect(body.result?.isError).toEqual(false)
    expect(chatTab.length).toEqual(1)
    expect(chatTab[0]).toInclude('"project":"linea"')
    expect(focused).toEqual([])
  })

  it('shows in the active tab, in the project it has open', async () => {
    const written: string[] = []
    const stream: TabStream = {
      write: (c) => keep(c) && written.push(c),
      end: () => {},
    }
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: 'linea', focusedAt: 2, sequence: 2 })
    const steps = [{ note: 'Hi' }]
    const dryRun = await call('tools/call', {
      name: 'show',
      arguments: { dryRun: true, steps },
    })
    expect(written).toEqual([])
    const shown = await call('tools/call', {
      name: 'show',
      arguments: { steps },
    })
    tabs.disconnect('tab-1', stream)
    expect(dryRun.result?.isError).toEqual(false)
    expect(shown.result?.isError).toEqual(false)
    expect(written.length).toEqual(1)
    expect(written[0]).toInclude('"project":"linea"')
  })

  it('shows a board in the active tab', async () => {
    const written: string[] = []
    const stream: TabStream = {
      write: (c) => keep(c) && written.push(c),
      end: () => {},
    }
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: 'linea', focusedAt: 4, sequence: 4 })
    const result = await call('tools/call', {
      name: 'board',
      arguments: {
        title: 'Delays',
        blocks: [
          { type: 'text', text: 'From discovered.json' },
          {
            type: 'table',
            columns: ['Contract', 'Delay'],
            rows: [['A', '7d']],
          },
        ],
      },
    })
    tabs.disconnect('tab-1', stream)
    expect(result.result?.isError).toEqual(false)
    expect(JSON.stringify(result.result?.content)).toInclude('1 rows')
    expect(written.length).toEqual(1)
    expect(written[0]).toInclude('"type":"board"')
  })

  it('names the table whose row lacks a cell', async () => {
    const result = await call('tools/call', {
      name: 'board',
      arguments: {
        title: 'Delays',
        blocks: [{ type: 'table', columns: ['A', 'B'], rows: [['only']] }],
      },
    })
    expect(result.result?.isError).toEqual(true)
    expect(JSON.stringify(result.result?.content)).toInclude(
      'Every row has one cell per column',
    )
  })

  it('asks the active tab for context over its stream', async () => {
    // The tab answers each request the way AgentBridge does, over HTTP.
    const stream: TabStream = {
      write: (chunk) => {
        const event = JSON.parse(chunk.slice('data: '.length))
        const body = {
          tab: 'tab-1',
          request: event.id,
          context: { project: 'linea', selected: [] },
        }
        void fetch(url.replace('/mcp', '/context'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      },
      end: () => {},
    }
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: 'linea', focusedAt: 3, sequence: 3 })
    const result = (await call('tools/call', { name: 'context' })).result
    tabs.disconnect('tab-1', stream)
    expect(result?.isError).toEqual(false)
    expect(JSON.stringify(result?.content)).toInclude('DiscoUI shows linea.')
  })

  // Like AgentBridge: the tab answers each request over HTTP, on the route
  // of its kind.
  function answeringTab(
    route: string,
    answer: (event: Record<string, unknown>) => object,
  ): TabStream & { events: Record<string, unknown>[] } {
    const events: Record<string, unknown>[] = []
    return {
      events,
      write: (chunk) => {
        if (!keep(chunk)) return
        const event = JSON.parse(chunk.slice('data: '.length))
        events.push(event)
        void fetch(url.replace('/mcp', route), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tab: 'tab-1',
            request: event.id,
            ...answer(event),
          }),
        })
      },
      end: () => {},
    }
  }

  // A large project's node view does not fit the other routes' 100kb.
  it('reads a node view larger than the other routes take', async () => {
    const items = Array.from({ length: 2_000 }, (_, index) => ({
      id: `group:${index}`,
      name: `Group number ${index}`,
      x: index,
      y: 0,
      width: 200,
      height: 50,
      members: [],
    }))
    const graph = {
      status: 'loaded',
      items,
      links: [[0, 1, 'owner']],
      hidden: [],
    }
    expect(JSON.stringify(graph).length > 100_000).toEqual(true)
    const stream = answeringTab('/graph', () => ({ graph }))
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: 'linea', focusedAt: 5, sequence: 5 })
    const result = (await call('tools/call', { name: 'graph' })).result
    tabs.disconnect('tab-1', stream)
    expect(stream.events[0]).toEqual({
      type: 'graph-request',
      id: stream.events[0]?.id,
      project: 'linea',
    })
    expect(result?.isError).toEqual(false)
    const text = (result?.content as { text: string }[])[0]?.text ?? ''
    expect(text).toInclude('linea node view: 2000 drawn, 0 hidden, 1 links.')
    expect(text).toInclude('group "Group number 0" at 0,0 200×50')
    expect(text).toInclude('→ Group number 1 (owner)')
  })

  it('still refuses a context answer over 100kb', async () => {
    const response = await fetch(url.replace('/mcp', '/context'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ padding: 'x'.repeat(200_000) }),
    })
    expect(response.status).toEqual(413)
  })

  it('sends the lanes as addresses and says what the tab drew', async () => {
    const stream = answeringTab('/layout', () => ({
      layout: {
        status: 'arranged',
        placed: [BRIDGE],
        below: [{ id: 'group:1', name: 'Admins' }],
        notDrawn: [INBOX],
      },
    }))
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: 'linea', focusedAt: 6, sequence: 6 })
    const result = (
      await call('tools/call', {
        name: 'layout',
        arguments: { lanes: [{ columns: [['Bridge'], ['Inbox']] }] },
      })
    ).result
    tabs.disconnect('tab-1', stream)
    expect(stream.events[0]).toEqual({
      type: 'layout-request',
      id: stream.events[0]?.id,
      project: 'linea',
      lanes: [[[BRIDGE], [INBOX]]],
      hideOthers: false,
    })
    expect(result?.isError).toEqual(false)
    const text = (result?.content as { text: string }[])[0]?.text ?? ''
    expect(text).toInclude('Lanes: 1, items placed: 1.')
    expect(text).toInclude('below the lanes: Admins.')
    expect(text).toInclude('Not drawn, so not placed: Inbox.')
  })

  it('tells the agent to open the node view the tab does not draw', async () => {
    const stream = answeringTab('/layout', () => ({
      layout: { status: 'not-loaded', project: 'arbitrum' },
    }))
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', { project: 'linea', focusedAt: 7, sequence: 7 })
    const result = (
      await call('tools/call', {
        name: 'layout',
        arguments: { lanes: [{ columns: [['Bridge']] }], others: 'hide' },
      })
    ).result
    tabs.disconnect('tab-1', stream)
    expect(stream.events[0]?.hideOthers).toEqual(true)
    expect(result?.isError).toEqual(true)
    const text = (result?.content as { text: string }[])[0]?.text ?? ''
    expect(text).toInclude('Call show for the project first')
    expect(text).toInclude('node view shows: arbitrum')
  })

  it('refuses lanes with an empty column before asking the tab', async () => {
    const result = await call('tools/call', {
      name: 'layout',
      arguments: { lanes: [{ columns: [[]] }] },
    })
    expect(result.result?.isError).toEqual(true)
    expect(JSON.stringify(result.result?.content)).toInclude(
      'A column names at least one contract',
    )
  })

  it('answers JSON it cannot parse with a JSON-RPC error', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"jsonrpc":',
    })
    expect(response.status).toEqual(400)
    expect(await response.json()).toEqual({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error' },
    })
  })

  it('answers a body over the size limit with a JSON-RPC error', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ padding: 'x'.repeat(200_000) }),
    })
    expect(response.status).toEqual(413)
    expect(await response.json()).toEqual({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32600, message: 'Request too large' },
    })
  })

  it('refuses a contract ref longer than any name', async () => {
    const result = await call('tools/call', {
      name: 'show',
      arguments: {
        dryRun: true,
        steps: [{ note: 'n', contracts: ['x'.repeat(201)] }],
      },
    })
    expect(result.result?.isError).toEqual(true)
    expect(JSON.stringify(result.result?.content)).toInclude(
      'Contract ref must be 1 to 200 characters',
    )
  })

  it('tells the agent a project name is wrong', async () => {
    const result = await call('tools/call', {
      name: 'show',
      arguments: { project: 'missing', dryRun: true, steps: [{ note: 'n' }] },
    })
    expect(result.result?.isError).toEqual(true)
    const content = result.result?.content as { text: string }[]
    expect(content[0]?.text).toInclude('No discovered project')
  })

  it('rejects unknown tools and methods as protocol errors', async () => {
    expect((await call('tools/call', { name: 'nope' })).error?.code).toEqual(
      -32602,
    )
    expect((await call('resources/list')).error?.code).toEqual(-32601)
  })

  it('takes notifications without an answer', async () => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'notifications/initialized',
      }),
    })
    expect(response.status).toEqual(202)
  })

  it('refuses GET, as it opens no server stream', async () => {
    expect((await fetch(url)).status).toEqual(405)
  })
})
