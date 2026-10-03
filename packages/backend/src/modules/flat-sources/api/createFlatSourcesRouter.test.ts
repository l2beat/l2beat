import { Logger } from '@l2beat/backend-tools'
import type { Database, FlatSourcesRecord } from '@l2beat/database'
import { FLAT_SOURCES_ZSTD_WINDOW_LOG, Hash256 } from '@l2beat/shared-pure'
import { randomBytes } from 'crypto'
import { expect, mockObject } from 'earl'
import { createServer, type Server } from 'http'
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
      get: async (projectId) =>
        record(projectId, { 'A.sol': `contract "${projectId}" {\n}` }),
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
      get: async () => {
        throw new Error('database failed')
      },
    })
    const url = await listen(flatSources)

    const response = await fetch(url)

    expect(response.status).toEqual(500)
  })

  it('aborts the body when the database fails after headers are sent', async () => {
    let releaseSecondProject = () => {}
    const headersReceived = new Promise<void>((resolve) => {
      releaseSecondProject = resolve
    })
    const flatSources = mockObject<Database['flatSources']>({
      getProjectIds: async () => ['a', 'b'],
      get: async (projectId) => {
        if (projectId === 'b') {
          await headersReceived
          throw new Error('database failed')
        }
        return record(projectId, {
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

  async function listen(flatSources: Database['flatSources']) {
    const controller = new FlatSourcesController(
      mockObject<Database>({ flatSources }),
    )
    const apiServer = new ApiServer(0, Logger.SILENT, [
      createFlatSourcesRouter(controller),
    ])
    const listening = createServer(apiServer.getNodeCallback())
    server = listening
    await new Promise<void>((resolve) => listening.listen(0, resolve))
    const { port } = listening.address() as AddressInfo
    return `http://localhost:${port}/api/flat-sources`
  }
})

function record(
  projectId: string,
  flat: Record<string, string>,
): FlatSourcesRecord {
  return { projectId, timestamp: 1, contentHash: CONTENT_HASH, flat }
}

function decompress(body: ArrayBuffer): string {
  return zstdDecompressSync(Buffer.from(body), {
    params: { [constants.ZSTD_d_windowLogMax]: FLAT_SOURCES_ZSTD_WINDOW_LOG },
  }).toString('utf8')
}
