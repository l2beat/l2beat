import { expect } from 'earl'
import type { Server } from 'http'
import type { AddressInfo } from 'net'
import { createDiscoveryUiApp } from './main'

// The agent routes act for the researcher on their own machine, so the
// readonly DiscoUI, which is served publicly, must not have them. Each case
// starts the app and pings the MCP endpoint over HTTP.
describe(createDiscoveryUiApp.name, () => {
  it('mounts no agent routes when readonly', async () => {
    expect(await pingAgent({ readonly: true })).toEqual(404)
  })

  it('mounts the agent routes when writable', async () => {
    expect(await pingAgent({ readonly: false })).toEqual(200)
  })
})

async function pingAgent(options: { readonly: boolean }): Promise<number> {
  const server: Server = createDiscoveryUiApp({ ...options, port: 0 }).listen(
    0,
    '127.0.0.1',
  )
  await new Promise((resolve) => server.once('listening', resolve))
  try {
    const { port } = server.address() as AddressInfo
    const response = await fetch(`http://127.0.0.1:${port}/api/agent/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping' }),
    })
    return response.status
  } finally {
    server.close()
  }
}
