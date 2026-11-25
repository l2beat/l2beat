import type { Project, ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { type InMemoryCache, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import express from 'express'
import type { AddressInfo } from 'net'
import { OpenApi } from '../OpenApi'
import { addActivityRoutes } from './activity/routes'
import { addProjectsRoutes } from './projects/routes'
import { addTvsRoutes } from './tvs/routes'

// Why: partners branch on what a 404 says, so "no project has this id" and
// "this project has no data of that kind" must stay apart, and the contracts
// and tokens routes must answer with a message rather than an empty body.
// How: the real routes run in a real Express app on a random port, over an
// in-memory project list. "across" exists but has no activity or TVS config.
// The database returns no rows; the tests read the status and JSON body, and
// which project ids reach the database and which keys reach the cache.
describe('per-project routes answer 404 with a message', () => {
  const PROJECTS = [
    project({ id: 'alpha', activity: true }),
    project({ id: 'across', activity: false }),
  ]

  let baseUrl: string
  let close: () => void
  let getActivityRecords: ReturnType<typeof mockGetActivityRecords>
  let cache: ReturnType<typeof mockCache>

  beforeEach(async () => {
    getActivityRecords = mockGetActivityRecords()
    const db = mockDatabase(getActivityRecords)
    cache = mockCache()
    const app = express()
    const openapi = new OpenApi(app, {} as never)
    const ps = fakeProjectService(PROJECTS)
    addProjectsRoutes(openapi, ps, db, cache)
    addTvsRoutes(openapi, ps, db, cache)
    addActivityRoutes(openapi, ps, db, cache)
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
    close = () => server.close()
  })

  afterEach(() => close())

  it('finds a project by its id', async () => {
    const res = await get('/v1/project/alpha')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(expect.subset({ id: 'alpha' }))
  })

  it('queries data and caches it under the project id', async () => {
    await get('/v1/activity/alpha')

    expect(getActivityRecords).toHaveBeenOnlyCalledWith(
      [ProjectId('alpha')],
      expect.anything(),
    )
    expect(cache.get).toHaveBeenOnlyCalledWith(
      expect.subset({ key: ['activity', 'alpha', '30d'] }),
      expect.anything(),
    )
  })

  for (const path of [
    '/v1/project/nope',
    '/v1/project/nope/contracts',
    '/v1/project/nope/tokens',
    '/v1/tvs/nope',
    '/v1/activity/nope',
  ]) {
    it(`answers 404 with a message for an unknown project: ${path}`, async () => {
      const res = await get(path)

      expect(res.status).toEqual(404)
      expect(res.body).toEqual({ message: 'No project has the id "nope"' })
    })
  }

  it('answers 404 with its own message for a project without activity data', async () => {
    const res = await get('/v1/activity/across')

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({
      message: 'Project "across" has no activity data',
    })
  })

  it('answers 404 with its own message for a project without TVS data', async () => {
    const res = await get('/v1/tvs/across')

    expect(res.status).toEqual(404)
    expect(res.body).toEqual({ message: 'Project "across" has no TVS data' })
  })

  async function get(path: string) {
    const res = await fetch(`${baseUrl}${path}`)
    return { status: res.status, body: await res.json() }
  }
})

interface FakeProject {
  id: ProjectId
  slug: string
  name: string
  activityConfig?: unknown
}

function project(opts: { id: string; activity: boolean }) {
  return {
    id: ProjectId(opts.id),
    slug: opts.id,
    name: opts.id,
    activityConfig: opts.activity ? { type: 'block' } : undefined,
  } satisfies FakeProject
}

// Mirrors ProjectDatabase.getProject: every `select` key must be present.
function fakeProjectService(projects: FakeProject[]) {
  return mockObject<ProjectService>({
    getProject: (async (query: {
      id?: string
      select?: (keyof FakeProject)[]
    }) => {
      const found = projects.find((p) => p.id === query.id)
      if (found && (query.select ?? []).every((k) => found[k] !== undefined)) {
        return found as unknown as Project
      }
      return undefined
    }) as ProjectService['getProject'],
  })
}

function mockGetActivityRecords() {
  return mockFn<Database['activity']['getByProjectsAndTimeRange']>().resolvesTo(
    [],
  )
}

function mockDatabase(
  getActivityRecords: ReturnType<typeof mockGetActivityRecords>,
) {
  return mockObject<Database>({
    activity: mockObject<Database['activity']>({
      getByProjectsAndTimeRange: getActivityRecords,
    }),
    syncMetadata: mockObject<Database['syncMetadata']>({
      getMaxTargetForFeature: mockFn().resolvesTo(UnixTime.now()),
      getByFeatureAndIds: mockFn().resolvesTo([]),
    }),
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
