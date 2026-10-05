import { Logger } from '@l2beat/backend-tools'
import type { Database, FlatSourcesJsonRecord } from '@l2beat/database'
import { FLAT_SOURCES_ZSTD_WINDOW_LOG, Hash256 } from '@l2beat/shared-pure'
import { randomBytes } from 'crypto'
import { expect, mockFn, mockObject } from 'earl'
import {
  Agent,
  createServer,
  get,
  type IncomingMessage,
  type Server,
} from 'http'
import type { AddressInfo } from 'net'
import { constants, zstdDecompressSync } from 'zlib'
import { ApiServer } from '../../../api/ApiServer'
import { createFlatSourcesRouter } from './createFlatSourcesRouter'
import { FlatSourcesController } from './FlatSourcesController'

const CONTENT_HASH = Hash256.random()

describe(createFlatSourcesRouter.name, () => {
  let server: Server | undefined

  afterEach(() => {
    server?.close()
    server = undefined
  })

  it('streams a header and one zstd compressed json line per project', async () => {
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a', 'b'],
      getJson: async (projectId) =>
        jsonRecord(projectId, { 'A.sol': `contract "${projectId}" {\n}` }),
    })
    const url = await listen(flatSources)

    const response = await fetch(url, {
      headers: { 'accept-encoding': 'gzip' },
    })

    expect(response.status).toEqual(200)
    expect(response.headers.get('content-type')).toEqual('application/zstd')
    expect(response.headers.get('content-encoding')).toEqual(null)
    const lines = decompress(await response.arrayBuffer()).split('\n')
    expect(lines).toEqual([
      JSON.stringify({ projectCount: 2 }),
      JSON.stringify({
        projectId: 'a',
        timestamp: 1,
        contentHash: CONTENT_HASH.toString(),
        flat: { 'A.sol': 'contract "a" {\n}' },
      }),
      JSON.stringify({
        projectId: 'b',
        timestamp: 1,
        contentHash: CONTENT_HASH.toString(),
        flat: { 'A.sol': 'contract "b" {\n}' },
      }),
      '',
    ])
  })

  it('responds with 500 when the database fails before anything is sent', async () => {
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a'],
      getJson: async () => {
        throw new Error('database failed')
      },
    })
    const url = await listen(flatSources)

    const response = await fetch(url)

    expect(response.status).toEqual(500)
  })

  it('keeps the connection after responding with 500', async () => {
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a'],
      getJson: async () => {
        throw new Error('database failed')
      },
    })
    const url = await listen(flatSources)
    const agent = new Agent({ keepAlive: true, maxSockets: 1 })

    const first = await request(url, agent)
    const second = await request(url, agent)
    agent.destroy()

    expect(first).toEqual({ status: 500, reusedSocket: false })
    expect(second).toEqual({ status: 500, reusedSocket: true })
  })

  it('aborts the body when the database fails after headers are sent', async () => {
    let releaseSecondProject = () => {}
    const headersReceived = new Promise<void>((resolve) => {
      releaseSecondProject = resolve
    })
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a', 'b'],
      getJson: async (projectId) => {
        if (projectId === 'b') {
          await headersReceived
          throw new Error('database failed')
        }
        return jsonRecord(projectId, {
          'A.sol': randomBytes(1_000_000).toString('hex'),
        })
      },
    })
    const url = await listen(flatSources)

    const response = await fetch(url)
    releaseSecondProject()

    expect(response.status).toEqual(200)
    await expect(response.arrayBuffer()).toBeRejected()
  })

  it('serves one stream at a time', async () => {
    let releaseSecondProject = () => {}
    const secondProjectReleased = new Promise<void>((resolve) => {
      releaseSecondProject = resolve
    })
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a', 'b'],
      getJson: async (projectId) => {
        if (projectId === 'b') {
          await secondProjectReleased
        }
        return jsonRecord(projectId, {
          'A.sol': randomBytes(1_000_000).toString('hex'),
        })
      },
    })
    const url = await listen(flatSources)

    const first = await fetch(url)
    const concurrent = await fetch(url)
    releaseSecondProject()
    await first.arrayBuffer()
    const later = await fetch(url)
    await later.arrayBuffer()

    expect(first.status).toEqual(200)
    expect(concurrent.status).toEqual(503)
    expect(concurrent.headers.get('retry-after')).toEqual('10')
    expect(later.status).toEqual(200)
  })

  it('accepts a new stream after the client disconnects', async () => {
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a', 'b'],
      getJson: async (projectId) =>
        jsonRecord(projectId, {
          'A.sol': randomBytes(1_000_000).toString('hex'),
        }),
    })
    const url = await listen(flatSources)
    const controller = new AbortController()
    const first = await fetch(url, { signal: controller.signal })
    expect(first.status).toEqual(200)

    controller.abort()
    let later = await fetch(url)
    for (let attempt = 0; later.status === 503 && attempt < 50; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 10))
      later = await fetch(url)
    }
    await later.arrayBuffer()

    expect(later.status).toEqual(200)
  })

  it('releases the stream after the deadline when the client stops reading', async () => {
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () =>
        Array.from({ length: 1000 }, (_, index) => `project-${index}`),
      getJson: async (projectId) =>
        jsonRecord(projectId, {
          'A.sol': randomBytes(1_000_000).toString('hex'),
        }),
    })
    const logger = mockObject<Logger>({ warn: mockFn().returns(undefined) })
    const url = await listen(flatSources, logger, 200)
    const stalled = await new Promise<IncomingMessage>((resolve) =>
      get(url, resolve),
    )
    stalled.pause()

    const statuses: number[] = []
    for (let attempt = 0; attempt < 100; attempt++) {
      const response = await fetch(url)
      await response.body?.cancel()
      statuses.push(response.status)
      if (response.status === 200) {
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
    stalled.destroy()

    expect(stalled.statusCode).toEqual(200)
    expect(statuses[0]).toEqual(503)
    expect(statuses.at(-1)).toEqual(200)
    expect(logger.warn).toHaveBeenOnlyCalledWith(
      'Flat sources stream deadline reached, closing',
      { bytesWritten: expect.a(Number) },
    )
  })

  async function listen(
    flatSources: Database['flatSources'],
    logger = Logger.SILENT,
    streamDeadlineMs?: number,
  ) {
    const controller = new FlatSourcesController(
      mockObject<Database>({ flatSources }),
    )
    const apiServer = new ApiServer(0, Logger.SILENT, [
      createFlatSourcesRouter(controller, logger, streamDeadlineMs),
    ])
    const listening = createServer(apiServer.getNodeCallback())
    server = listening
    await new Promise<void>((resolve) => listening.listen(0, resolve))
    const { port } = listening.address() as AddressInfo
    return `http://localhost:${port}/api/flat-sources`
  }
})

function jsonRecord(
  projectId: string,
  flat: Record<string, string>,
): FlatSourcesJsonRecord {
  return {
    projectId,
    timestamp: 1,
    contentHash: CONTENT_HASH,
    flatJson: JSON.stringify(flat),
  }
}

function request(
  url: string,
  agent: Agent,
): Promise<{ status: number | undefined; reusedSocket: boolean }> {
  return new Promise((resolve, reject) => {
    const outgoing = get(url, { agent }, (response) => {
      response.resume()
      response.on('end', () =>
        resolve({
          status: response.statusCode,
          reusedSocket: outgoing.reusedSocket,
        }),
      )
    })
    outgoing.on('error', reject)
  })
}

function decompress(body: ArrayBuffer): string {
  return zstdDecompressSync(Buffer.from(body), {
    params: { [constants.ZSTD_d_windowLogMax]: FLAT_SOURCES_ZSTD_WINDOW_LOG },
  }).toString('utf8')
}
