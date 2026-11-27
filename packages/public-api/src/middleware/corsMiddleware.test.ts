import type { Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { expect } from 'earl'
import express from 'express'
import { corsMiddleware } from './corsMiddleware'

// Why: the API is open to everyone, including dashboards that call it from a
// browser on another origin, and partners who still send the key they were
// once given must keep being served.
// How: a real express app with the middleware and one route, called over HTTP.
describe(corsMiddleware.name, () => {
  let server: Server
  let baseUrl: string

  beforeEach(async () => {
    const app = express()
    app.use(corsMiddleware())
    app.get('/v1/ping', (_, res) => {
      res.json({ ok: true })
    })
    server = await new Promise<Server>((resolve) => {
      const s = app.listen(0, () => resolve(s))
    })
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
  })

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve))
  })

  it('lets any origin read a response', async () => {
    const res = await fetch(`${baseUrl}/v1/ping`)

    expect(res.status).toEqual(200)
    expect(res.headers.get('Access-Control-Allow-Origin')).toEqual('*')
  })

  it('serves a request that still sends an API key', async () => {
    const res = await fetch(`${baseUrl}/v1/ping?apiKey=old-key`, {
      headers: { 'x-api-key': 'old-key' },
    })

    expect(res.status).toEqual(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('answers a preflight request without running the route', async () => {
    const res = await fetch(`${baseUrl}/v1/ping`, { method: 'OPTIONS' })

    expect(res.status).toEqual(204)
    expect(res.headers.get('Access-Control-Allow-Methods')).toEqual(
      'GET, OPTIONS',
    )
  })

  // fetch in Node sends no preflight, so the one a browser would send for a
  // request with an x-api-key header is made by hand
  it('lets a browser send the API key header an older integration uses', async () => {
    const res = await fetch(`${baseUrl}/v1/ping`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://dashboard.example',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'x-api-key',
      },
    })

    expect(res.status).toEqual(204)
    expect(res.headers.get('Access-Control-Allow-Headers')).toEqual('x-api-key')
  })
})
