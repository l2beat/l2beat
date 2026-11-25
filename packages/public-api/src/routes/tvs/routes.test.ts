import type { Project, ProjectService } from '@l2beat/config'
import type {
  Database,
  SummedByTimestampTokenValueRecord,
} from '@l2beat/database'
import { type InMemoryCache, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import express from 'express'
import type { AddressInfo } from 'net'
import { OpenApi } from '../../OpenApi'
import { addTvsRoutes } from './routes'
import type { TvsResultItem } from './types'

// Why: people decide where to put money from these charts, so a missing hour
// must not read as "this project secured nothing", the ETH price must match
// the website's, and the token filters must reach the database without
// changing what existing callers get by default.
// How: the real routes run in a real Express app on a random port. The
// database returns hand-made rows for two six-hour points with a gap between
// them; the tests read the JSON response, and which options reach the query
// and which keys reach the cache.
describe('/v1/tvs', () => {
  const SIX_HOURS = 6 * UnixTime.HOUR
  const T0 = UnixTime.toStartOf(UnixTime.now(), 'day') - 3 * UnixTime.DAY
  // One six-hour step between them has no record
  const T2 = T0 + 2 * SIX_HOURS

  let baseUrl: string
  let close: () => void
  let getSummed: ReturnType<typeof mockGetSummed>
  let cache: ReturnType<typeof mockCache>

  beforeEach(async () => {
    getSummed = mockGetSummed([record(T0, 100), record(T2, 300)])
    cache = mockCache()
    const db = mockObject<Database>({
      tvsTokenValue: mockObject<Database['tvsTokenValue']>({
        getSummedByTimestampByProjects: getSummed,
      }),
    })
    const app = express()
    const openapi = new OpenApi(app, {} as never)
    addTvsRoutes(openapi, fakeProjectService(), db, cache)
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
    close = () => server.close()
  })

  afterEach(() => close())

  it('leaves out a timestamp without data, not reporting it as zero', async () => {
    const res = await get('/v1/tvs/alpha')

    expect(res.status).toEqual(200)
    expect(res.body.map((p) => p.timestamp)).toEqual([T0, T2])
  })

  for (const [path, keyPrefix] of [
    ['/v1/tvs', ['tvs', '30d']],
    ['/v1/tvs/alpha', ['tvs', 'alpha', '30d']],
  ] as const) {
    it(`counts every token by default, as before: ${path}`, async () => {
      await get(path)

      expect(getSummed).toHaveBeenOnlyCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.subset({
          excludeAssociatedTokens: false,
          excludeRwaRestrictedTokens: false,
        }),
      )
    })

    it(`passes each filter to the query and the cache key: ${path}`, async () => {
      await get(`${path}?excludeAssociatedTokens=true`)
      await get(`${path}?excludeRwaRestrictedTokens=true`)

      expect(getSummed).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.subset({
          excludeAssociatedTokens: true,
          excludeRwaRestrictedTokens: false,
        }),
      )
      expect(getSummed).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.subset({
          excludeAssociatedTokens: false,
          excludeRwaRestrictedTokens: true,
        }),
      )
      expect(cache.get.calls.map((call) => call.args[0].key)).toEqual([
        [
          ...keyPrefix,
          'excludeAssociatedTokens=true',
          'excludeRwaRestrictedTokens=false',
        ],
        [
          ...keyPrefix,
          'excludeAssociatedTokens=false',
          'excludeRwaRestrictedTokens=true',
        ],
      ])
    })

    it(`answers 400 for a filter that is not true or false: ${path}`, async () => {
      const res = await get<{ path: string }>(
        `${path}?excludeRwaRestrictedTokens=yes`,
      )

      expect(res.status).toEqual(400)
      expect(res.body).toEqual(
        expect.subset({ path: '.query.excludeRwaRestrictedTokens' }),
      )
      expect(getSummed).not.toHaveBeenCalled()
    })
  }

  async function get<T = TvsResultItem[]>(path: string) {
    const res = await fetch(`${baseUrl}${path}`)
    return { status: res.status, body: (await res.json()) as T }
  }
})

function record(
  timestamp: UnixTime,
  value: number,
): SummedByTimestampTokenValueRecord {
  return {
    timestamp,
    value,
    canonical: value,
    customCanonical: 0,
    external: 0,
    native: 0,
    ether: value,
    stablecoin: 0,
    btc: 0,
    rwaRestricted: 0,
    rwaPublic: 0,
    other: 0,
  }
}

function mockGetSummed(records: SummedByTimestampTokenValueRecord[]) {
  return mockFn<
    Database['tvsTokenValue']['getSummedByTimestampByProjects']
  >().resolvesTo(records)
}

function fakeProjectService() {
  const alpha = { id: ProjectId('alpha'), slug: 'alpha', tvsConfig: [] }
  return mockObject<ProjectService>({
    getProject: (async () =>
      alpha as unknown as Project) as ProjectService['getProject'],
    getProjects: (async () => [
      alpha as unknown as Project,
    ]) as ProjectService['getProjects'],
  })
}

function mockCache() {
  return mockObject<InMemoryCache>({
    get: mockFn(
      async (_options: unknown, fallback: () => Promise<unknown>) =>
        await fallback(),
    ) as unknown as InMemoryCache['get'],
  })
}
