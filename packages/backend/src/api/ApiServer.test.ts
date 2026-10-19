import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import { expect, mockFn, mockObject } from 'earl'
import { createServer, get, type Server } from 'http'
import type { AddressInfo } from 'net'
import { Readable } from 'stream'
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
    router.get('/stream', (ctx) => {
      ctx.compress = false
      ctx.body = Readable.from(chunks())
    })
    const url = await listen(logger, router)

    await new Promise<void>((resolve) => {
      get(`${url}/stream`, (response) => {
        response.once('data', () => {
          response.socket.resetAndDestroy()
          resolve()
        })
      })
    })
    await waitUntilLogged(logger.info, 'Client disconnected')

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
      throw Object.assign(new Error('read ECONNRESET'), { code: 'ECONNRESET' })
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

async function* chunks() {
  for (let index = 0; index < 1000; index++) {
    yield Buffer.alloc(64 * 1024)
    await new Promise((resolve) => setImmediate(resolve))
  }
}

async function waitUntilLogged(
  log: { calls: { args: unknown[] }[] },
  message: string,
) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (log.calls.some((call) => call.args[0] === message)) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
}
