import type { ConfigReader } from '@l2beat/discovery'
import { expect, mockObject } from 'earl'
import express from 'express'
import type { Server } from 'http'
import type { AddressInfo } from 'net'
import { attachMcpRoutes } from './mcp'
import { createAgentRouter } from './router'
import { AgentTabs, type TabStream } from './tabs'

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
      readDiscoveryWithReferences: () => [],
    })
    app.use('/api/agent', createAgentRouter(configReader, tabs))
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
    expect(tools.map((t) => t.name)).toEqual(['show', 'clear'])
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
    const stream: TabStream = { write: (c) => written.push(c), end: () => {} }
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', undefined, 1)
    const result = (await call('tools/call', { name: 'clear' })).result
    tabs.disconnect('tab-1', stream)
    expect(result?.isError).toEqual(false)
    expect(written).toEqual(['data: {"type":"clear"}\n\n'])
  })

  it('shows in the active tab, in the project it has open', async () => {
    const written: string[] = []
    const stream: TabStream = { write: (c) => written.push(c), end: () => {} }
    tabs.connect('tab-1', stream)
    tabs.report('tab-1', 'linea', 2)
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
