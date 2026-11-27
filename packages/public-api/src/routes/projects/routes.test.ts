import { ProjectService } from '@l2beat/config'
import type { Database } from '@l2beat/database'
import { type InMemoryCache, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { expect, mockFn, mockObject } from 'earl'
import express from 'express'
import type { AddressInfo } from 'net'
import { OpenApi } from '../../OpenApi'
import { addProjectsRoutes } from './routes'
import { type ProjectData, ProjectSchema } from './types'

// Why: consumers read a project's stage, risks and TVS from the list and from
// the single-project route, so both must describe a project identically, in
// the published schema, for every project we really have. A project we have
// no assessment or TVS for must say so, not show an empty or zero value.
// How: the real routes run in a real Express app on a random port, over the
// real project config. The database has TVS rows for Arbitrum only.
describe('/v1/projects', () => {
  const NOW = UnixTime.toStartOf(UnixTime.now(), 'hour')
  const ps = new ProjectService()

  let baseUrl: string
  let close: () => void

  beforeEach(async () => {
    const db = mockObject<Database>({
      tvsTokenValue: mockObject<Database['tvsTokenValue']>({
        getSummedByProjectAtLatestAndSevenDaysBefore: async () => [
          tvsRow('arbitrum', NOW - 7 * UnixTime.DAY, 80),
          tvsRow('arbitrum', NOW, 100),
        ],
      }),
      syncMetadata: mockObject<Database['syncMetadata']>({
        getByFeature: mockFn().resolvesTo([{ id: 'arbitrum-ETH' }]),
        getMaxTargetForFeature: async () => NOW,
      }),
      updateDiff: mockObject<Database['updateDiff']>({
        getAll: async () => [],
      }),
    })
    const app = express()
    const openapi = new OpenApi(app, {} as never)
    addProjectsRoutes(openapi, ps, db, mockCache())
    const server = app.listen(0)
    await new Promise((resolve) => server.once('listening', resolve))
    baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`
    close = () => server.close()
  })

  afterEach(() => close())

  it('lists every project in the published schema', async () => {
    const projects = await get<ProjectData[]>('/v1/projects')
    const all = await ps.getProjects({})

    expect(v.array(ProjectSchema).safeParse(projects).success).toEqual(true)
    expect(projects.map((p) => p.id).sort()).toEqual(
      all.map((p) => p.id.toString()).sort(),
    )
  })

  it('gives a stage and five risks to scaling projects only', async () => {
    const projects = await get<ProjectData[]>('/v1/projects')
    const scaling = new Set(
      (await ps.getProjects({ where: ['scalingInfo'] })).map((p) =>
        p.id.toString(),
      ),
    )

    const assessed = projects.filter(
      (p) => p.stage !== undefined && p.risks?.length === 5,
    )
    const unassessed = projects.filter(
      (p) => !('stage' in p) && !('risks' in p),
    )

    expect(assessed.map((p) => p.id).sort()).toEqual([...scaling].sort())
    expect(assessed.length + unassessed.length).toEqual(projects.length)
    expect(unassessed.length).toBeGreaterThan(0)
  })

  it('reports TVS where it is synced and null elsewhere', async () => {
    const projects = await get<ProjectData[]>('/v1/projects')

    expect(projects.find((p) => p.id === 'arbitrum')?.tvs).toEqual({
      timestamp: NOW,
      breakdown: { total: 100, ether: 10, stablecoin: 20, associated: 5 },
      change7d: 0.25,
    })
    expect(
      projects.filter((p) => p.id !== 'arbitrum').every((p) => p.tvs === null),
    ).toEqual(true)
  })

  it('filters by isArchived', async () => {
    const archived = new Set(
      (await ps.getProjects({ where: ['archivedAt'] })).map((p) =>
        p.id.toString(),
      ),
    )
    const all = await get<ProjectData[]>('/v1/projects')
    const active = await get<ProjectData[]>('/v1/projects?isArchived=false')
    const inactive = await get<ProjectData[]>('/v1/projects?isArchived=true')

    expect(archived.size).toBeGreaterThan(0)
    expect(inactive.map((p) => p.id).sort()).toEqual([...archived].sort())
    expect(active.some((p) => archived.has(p.id))).toEqual(false)
    expect(active.length + inactive.length).toEqual(all.length)
  })

  it('returns the same project from /v1/project/:projectId', async () => {
    const projects = await get<ProjectData[]>('/v1/projects')
    const project = await get<ProjectData>('/v1/project/arbitrum')

    expect(project.tvs).not.toEqual(null)
    expect(project).toEqual(projects.find((p) => p.id === 'arbitrum') as never)
  })

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`)
    expect(res.status).toEqual(200)
    return (await res.json()) as T
  }
})

function tvsRow(project: string, timestamp: UnixTime, value: number) {
  return {
    project,
    timestamp,
    value,
    canonical: 0,
    customCanonical: 0,
    external: 0,
    native: 0,
    ether: value / 10,
    stablecoin: value / 5,
    btc: 0,
    rwaRestricted: 0,
    rwaPublic: 0,
    other: 0,
    associated: value / 20,
  }
}

function mockCache() {
  return mockObject<InMemoryCache>({
    get: mockFn(
      async (_options: unknown, fallback: () => Promise<unknown>) =>
        await fallback(),
    ) as unknown as InMemoryCache['get'],
  })
}
