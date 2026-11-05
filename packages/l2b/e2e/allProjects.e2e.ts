import { ConfigReader, getDiscoveryPaths } from '@l2beat/discovery'
import { expect } from 'earl'
import type { Server } from 'http'
import { createDiscoveryUiApp } from '../src/implementations/discovery-ui/main'
import type { ApiProjectResponse } from '../src/implementations/discovery-ui/types'

const projects = new ConfigReader(
  getDiscoveryPaths().discovery,
).readAllDiscoveredProjects()

describe('DiscoUI backend serves every project', function () {
  this.timeout(60_000)

  let server: Server
  let baseUrl: string

  before((done) => {
    server = createDiscoveryUiApp({ readonly: false }).listen(0, () => {
      const address = server.address()
      expect(address).not.toBeA(String)
      expect(address).not.toBeNullish()
      if (address === null || typeof address === 'string') return
      baseUrl = `http://127.0.0.1:${address.port}`
      done()
    })
  })

  after((done) => {
    server.close(done)
  })

  it('lists projects', async () => {
    const listed = (await getJson(baseUrl, '/api/projects')) as {
      name: string
    }[]
    expect(listed.map((p) => p.name).sort()).toEqual([...projects].sort())
  })

  it('reports config health', async () => {
    await getJson(baseUrl, '/api/config/health')
  })

  for (const project of projects) {
    it(project, async () => {
      const response = (await getJson(
        baseUrl,
        `/api/projects/${project}`,
      )) as ApiProjectResponse
      expect(response.entries.length).toBeGreaterThan(0)

      await getJson(baseUrl, `/api/projects/${project}/preview`)
      await getJson(baseUrl, `/api/projects/${project}/diff-history`)
      await getJson(baseUrl, `/api/projects/${project}/layouts`)
      await getJson(baseUrl, `/api/config/sync-status/${project}`)
      await getJson(baseUrl, `/api/config-files/${project}`)
    })
  }
})

async function getJson(baseUrl: string, path: string): Promise<unknown> {
  const response = await fetch(baseUrl + path, {
    signal: AbortSignal.timeout(30_000),
  })
  const body = await response.text()
  if (response.status !== 200) {
    throw new Error(
      `${path} -> HTTP ${response.status}\n${body.slice(0, 1500)}`,
    )
  }
  return JSON.parse(body)
}
