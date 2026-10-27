import type { ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'
import express from 'express'
import type { AddressInfo } from 'net'
import { attachMcpRouter, MCP_PATH } from './mcp'
import type { AgentContext, AgentReceipt } from './router'
import { AgentSession } from './session'

// A real HTTP round trip against a DiscoUI with no tab open, the way an
// agent's MCP client calls it.
describe(attachMcpRouter.name, () => {
  let url = ''
  let close = () => {}

  before(async () => {
    const app = express()
    app.use(express.json())
    attachMcpRouter(app, {
      configReader: { hasDiscovery: () => false } as unknown as ConfigReader,
      session: new AgentSession<AgentContext, AgentReceipt>(),
    })
    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}${MCP_PATH}`
    close = () => server.close()
  })

  after(() => close())

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
    const unknown = await call('initialize', { protocolVersion: '2099-01-01' })
    expect(unknown.result?.protocolVersion).toEqual('2025-11-25')
  })

  it('lists every tool with an object schema', async () => {
    const tools = (await call('tools/list')).result?.tools as {
      name: string
      inputSchema: { type: string; $schema?: string }
    }[]
    expect(tools.map((t) => t.name)).toEqual([
      'context',
      'state',
      'find',
      'permissions',
      'show',
      'view',
      'control_map',
      'discard',
      'clear',
    ])
    for (const tool of tools) {
      expect(tool.inputSchema.type).toEqual('object')
      expect(tool.inputSchema.$schema).toEqual(undefined)
    }
  })

  it('answers a failed tool as a result the agent can read', async () => {
    const result = (await call('tools/call', { name: 'context' })).result
    expect(result?.isError).toEqual(true)
    expect(JSON.stringify(result?.content)).toInclude('No DiscoUI tab is open')

    const invalid = await call('tools/call', {
      name: 'permissions',
      arguments: { contract: 7 },
    })
    expect(invalid.result?.isError).toEqual(true)
    expect(JSON.stringify(invalid.result?.content)).toInclude('At .contract')
  })

  it('names a project that has no discovery', async () => {
    const result = (
      await call('tools/call', {
        name: 'find',
        arguments: { project: 'nope', selectors: ['all'] },
      })
    ).result
    expect(result?.isError).toEqual(true)
    expect(JSON.stringify(result?.content)).toInclude(
      'No discovered project named nope',
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
})
