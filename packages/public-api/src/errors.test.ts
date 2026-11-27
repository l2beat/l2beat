import type { Logger } from '@l2beat/backend-tools'
import { v } from '@l2beat/validate'
import { expect, mockFn, mockObject } from 'earl'
import express from 'express'
import type { AddressInfo } from 'net'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { type InvalidResponse, OpenApi } from './OpenApi'

// Why: clients parse every answer as JSON and read `message` from an error.
// An HTML or plain-text error page breaks them exactly when something is
// already wrong. And a route whose answer drifts from the schema it documents
// misleads everyone who generated a client from the spec. A CDN that caches
// an error keeps serving it after the cause is gone.
// How: a real Express app on a random port, wired like index.ts, with three
// routes: one that answers as documented, one that throws, and one whose
// body does not match its schema.
describe('errors', () => {
  let baseUrl: string
  let close: () => void
  let onInvalidResponse: ReturnType<typeof mockFn<[InvalidResponse], void>>

  beforeEach(async () => {
    onInvalidResponse = mockFn<[InvalidResponse], void>().returns(undefined)
    const logger = mockObject<Logger>({
      for: () =>
        mockObject<Logger>({
          error: mockFn().returns(undefined),
          warn: mockFn().returns(undefined),
        }),
    })
    const app = express()
    const openapi = new OpenApi(app, {} as never, onInvalidResponse)
    const result = v.object({ value: v.number() })
    openapi.get(
      '/v1/ok',
      { operationId: 'ok', result, query: v.object({ range: v.string() }) },
      (_, res) => {
        res.json({ value: 1 })
      },
    )
    openapi.get(
      '/v1/item/:id',
      { operationId: 'item', result, params: v.object({ id: v.string() }) },
      (_, res) => {
        res.json({ value: 1 })
      },
    )
    openapi.get('/v1/throws', { operationId: 'throws', result }, () => {
      throw new Error('boom')
    })
    openapi.get('/v1/drifted', { operationId: 'drifted', result }, (_, res) => {
      res.json({ value: 'one' } as never)
    })
    app.use(notFoundHandler())
    app.use(errorHandler(logger))
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
    close = () => server.close()
  })

  afterEach(() => close())

  it('answers 404 as JSON for a path that is not an endpoint', async () => {
    const res = await request('/v1/nope')

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({
      message: 'No endpoint at /v1/nope. The endpoints are listed at /docs.',
    })
  })

  it('answers 405 as JSON for a method other than GET', async () => {
    const res = await request('/v1/ok?range=7d', { method: 'POST' })

    expect(res.status).toEqual(405)
    expect(res.allow).toEqual('GET, HEAD, OPTIONS')
    expect(res.body).toEqual({ message: expect.includes('POST') })
  })

  it('answers 500 as JSON with an error id when a route fails', async () => {
    const res = await request('/v1/throws')

    expect(res.status).toEqual(500)
    expect(res.body).toEqual({
      message: 'Internal server error',
      errorId: expect.a(String),
    })
  })

  it('answers 400 in the documented shape for a path it cannot decode', async () => {
    const res = await request('/v1/item/%ZZ')

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({
      path: '.params',
      message: 'The path has broken percent-encoding.',
    })
  })

  it('answers 400 for a query parameter the endpoint does not take', async () => {
    const res = await request('/v1/ok?range=7d&rnage=30d')

    expect(res.status).toEqual(400)
    expect(res.body).toEqual({
      path: '.query.rnage',
      message: 'Unknown query parameter. This endpoint takes: range.',
    })
  })

  it('still serves an older integration that sends its API key', async () => {
    const res = await request('/v1/ok?range=7d&apiKey=secret')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual({ value: 1 })
  })

  it('reports a body that does not match the documented schema', async () => {
    const res = await request('/v1/drifted')

    expect(onInvalidResponse).toHaveBeenOnlyCalledWith({
      path: '/v1/drifted',
      status: 200,
      bodyPath: '.value',
      message: expect.a(String),
    })
    // The reporter decides what happens next. This one lets the body through.
    expect(res.status).toEqual(200)
  })

  it('lets a 200 be cached, at a CDN longer than at the client', async () => {
    const res = await request('/v1/ok?range=7d')

    expect(res.cacheControl).toEqual(
      'public, max-age=60, s-maxage=300, stale-while-revalidate=300',
    )
  })

  for (const [name, path, init] of [
    ['a 400', '/v1/ok?range=7d&rnage=30d', undefined],
    ['a 404', '/v1/nope', undefined],
    ['a 405', '/v1/ok?range=7d', { method: 'POST' }],
    ['a 500', '/v1/throws', undefined],
  ] as const) {
    it(`forbids caching ${name}`, async () => {
      const res = await request(path, init)

      expect(res.cacheControl).toEqual('no-store')
    })
  }

  it('does not report a body that matches', async () => {
    await request('/v1/ok?range=7d')

    expect(onInvalidResponse).not.toHaveBeenCalled()
  })

  async function request(path: string, init?: RequestInit) {
    const res = await fetch(`${baseUrl}${path}`, init)
    return {
      status: res.status,
      allow: res.headers.get('allow'),
      cacheControl: res.headers.get('cache-control'),
      body: await res.json(),
    }
  }
})
