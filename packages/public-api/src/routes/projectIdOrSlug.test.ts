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

// Why: callers of the website API address projects by slug, and a slug is
// not always the id. These tests pin how `:projectId` resolves and what a
// 404 says, because partners branch on both.
// How: the real routes run in a real Express app on a random port, over an
// in-memory project list. "alpha" is both the id of one project and the slug
// of another, which no real project does today, so id precedence can be
// checked. The database returns no rows; the tests read which project ids
// reach it and which keys reach the cache.
describe('per-project routes accept an id or a slug', () => {
  const PROJECTS = [
    project({ id: 'alpha', slug: 'alpha-one', activity: true }),
    project({ id: 'other', slug: 'alpha', activity: true }),
    project({ id: 'across', slug: 'across', activity: false }),
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
    const res = await get('/v1/project/other')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(expect.subset({ id: 'other', slug: 'alpha' }))
  })

  it('finds a project by a slug that differs from its id', async () => {
    const res = await get('/v1/project/alpha-one')

    expect(res.status).toEqual(200)
    expect(res.body).toEqual(expect.subset({ id: 'alpha' }))
  })

  it('prefers the id when the value is one project id and another slug', async () => {
    const res = await get('/v1/project/alpha')

    expect(res.body).toEqual(expect.subset({ id: 'alpha' }))
    expect(res.body).not.toEqual(expect.subset({ id: 'other' }))
  })

  it('queries data and caches it under the resolved id', async () => {
    await get('/v1/activity/alpha-one')

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
      expect(res.body).toEqual({
        message: 'No project has the id or slug "nope"',
      })
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

function project(opts: { id: string; slug: string; activity: boolean }) {
  return {
    id: ProjectId(opts.id),
    slug: opts.slug,
    name: opts.id,
    activityConfig: opts.activity ? { type: 'block' } : undefined,
  } satisfies FakeProject
}

// Mirrors ProjectDatabase.getProject: id wins over slug when both are given,
// and every `select` key must be present.
function fakeProjectService(projects: FakeProject[]) {
  return mockObject<ProjectService>({
    getProject: (async (query: {
      id?: string
      slug?: string
      select?: (keyof FakeProject)[]
    }) => {
      const found = projects.find((p) =>
        query.id !== undefined ? p.id === query.id : p.slug === query.slug,
      )
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
