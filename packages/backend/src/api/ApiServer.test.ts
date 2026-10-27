import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import { createServer, get, type Server } from 'http'
import type { AddressInfo } from 'net'
import { PassThrough, pipeline, Readable } from 'stream'
import { ApiServer } from './ApiServer'

describe(ApiServer.name, () => {
  let server: Server | undefined

  afterEach(() => {
    server?.close()
    server = undefined
  })

  it('logs a client that resets the connection mid-stream as info', async () => {
    const logger = mockLogger()
    const router = new Router()
    const socketClosed = new Promise<void>((resolve) => {
      router.get('/stream', (ctx) => {
        ctx.req.socket.once('close', resolve)
        ctx.compress = false
        ctx.body = Readable.from(chunks())
      })
    })
    const url = await listen(logger, router)

    get(`${url}/stream`, (response) => {
      response.once('data', () => response.socket.resetAndDestroy())
    })
    await socketClosed

    expect(logger.info).toHaveBeenCalledWith('Client disconnected', {
      code: expect.a(String),
      method: 'GET',
      url: '/stream',
    })
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('logs a disconnect error as error while the client is connected', async () => {
    const logger = mockLogger()
    const router = new Router()
    router.get('/upstream', () => {
      throw upstreamReset()
    })
    const url = await listen(logger, router)

    const response = await fetch(`${url}/upstream`)

    expect(response.status).toEqual(500)
    expect(logger.error).toHaveBeenCalledWith(
      'Request failed',
      expect.a(Error),
      expect.a(Object),
    )
    expect(logger.info).not.toHaveBeenCalledWith(
      'Client disconnected',
      expect.anything(),
    )
  })

  it('logs a disconnect error as error when the server destroys the response', async () => {
    const logger = mockLogger()
    const router = new Router()
    const socketClosed = new Promise<void>((resolve) => {
      router.get('/stream', (ctx) => {
        ctx.req.socket.once('close', resolve)
        ctx.compress = false
        ctx.body = pipeline(
          Readable.from(failAfterFirstChunk(upstreamReset())),
          new PassThrough(),
          (error) => {
            if (error) {
              ctx.res.destroy(error)
            }
          },
        )
      })
    })
    const url = await listen(logger, router)

    get(`${url}/stream`, (response) => {
      response.resume()
      response.on('error', () => {})
    })
    await socketClosed

    expect(logger.error).toHaveBeenCalledWith(
      'Request failed',
      expect.a(Error),
      expect.a(Object),
    )
    expect(logger.info).not.toHaveBeenCalledWith(
      'Client disconnected',
      expect.anything(),
    )
  })

  async function listen(logger: Logger, router: Router) {
    const apiServer = new ApiServer(0, logger, [router])
    const listening = createServer(apiServer.getNodeCallback())
    server = listening
    await new Promise<void>((resolve) => listening.listen(0, resolve))
    const { port } = listening.address() as AddressInfo
    return `http://localhost:${port}`
  }
})

function mockLogger() {
  const logger = mockObject<Logger>({
    for: (): Logger => logger,
    info: mockFn().returns(undefined),
    error: mockFn().returns(undefined),
  })
  return logger
}

function upstreamReset() {
  return Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' })
}

async function* chunks() {
  for (let index = 0; index < 1000; index++) {
    yield Buffer.alloc(64 * 1024)
    await new Promise((resolve) => setImmediate(resolve))
  }
}

async function* failAfterFirstChunk(error: Error) {
  yield Buffer.alloc(64 * 1024)
  await new Promise((resolve) => setImmediate(resolve))
  throw error
}
