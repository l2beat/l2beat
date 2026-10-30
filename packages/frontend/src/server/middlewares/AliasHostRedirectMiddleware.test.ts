import { request } from 'node:http'
import type { AddressInfo } from 'node:net'
import { expect } from 'earl'
import express from 'express'
import { AliasHostRedirectMiddleware } from './AliasHostRedirectMiddleware'

const CANONICAL_ORIGIN = 'https://l2beat.com'
const ALIAS_HOSTS = ['www.l2beat.com', 'alias.example']

// Method: serve the middleware in front of a catch-all handler and send raw
// HTTP requests with a chosen Host header (fetch overrides Host), then read
// the status and Location the client would follow.
describe(AliasHostRedirectMiddleware.name, () => {
  it('redirects an alias host to the same path and query on the canonical origin', async () => {
    const response = await get(
      'www.l2beat.com',
      '/layer2s/projects/arbitrum?tab=risk',
    )

    expect(response).toEqual({
      status: 301,
      location: 'https://l2beat.com/layer2s/projects/arbitrum?tab=risk',
    })
  })

  it('recognizes an alias host whatever its case or port', async () => {
    const response = await get('WWW.L2BEAT.com:443', '/faq')

    expect(response).toEqual({
      status: 301,
      location: 'https://l2beat.com/faq',
    })
  })

  it('keeps the method of a non-GET request', async () => {
    const response = await send('POST', 'alias.example', '/api/trpc/x')

    expect(response).toEqual({
      status: 308,
      location: 'https://l2beat.com/api/trpc/x',
    })
  })

  it('serves hosts that are not aliases', async () => {
    for (const host of ['l2beat.com', 'fe-prod.l2beat.com', 'localhost:3000']) {
      expect(await get(host, '/faq')).toEqual({ status: 200 })
    }
  })

  it('serves the canonical host even when it is listed as an alias', async () => {
    const response = await get('l2beat.com', '/faq', ['l2beat.com'])

    expect(response).toEqual({ status: 200 })
  })

  it('serves health checks on an alias host', async () => {
    expect(await get('alias.example', '/health')).toEqual({ status: 200 })
  })
})

function get(host: string, path: string, aliasHosts = ALIAS_HOSTS) {
  return send('GET', host, path, aliasHosts)
}

async function send(
  method: string,
  host: string,
  path: string,
  aliasHosts = ALIAS_HOSTS,
): Promise<{ status: number; location?: string }> {
  const app = express()
  app.use(AliasHostRedirectMiddleware(CANONICAL_ORIGIN, aliasHosts))
  app.all('/{*path}', (_req, res) => {
    res.send('page')
  })

  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address() as AddressInfo

  try {
    return await new Promise((resolve, reject) => {
      request({ port, method, path, headers: { host } }, (res) => {
        res.resume()
        const status = res.statusCode ?? 0
        const location = res.headers.location
        resolve(location === undefined ? { status } : { status, location })
      })
        .on('error', reject)
        .end()
    })
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}
