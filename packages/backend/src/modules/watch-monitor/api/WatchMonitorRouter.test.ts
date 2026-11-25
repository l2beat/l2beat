import type Router from '@koa/router'
import type { Database, WatchMonitorRecord } from '@l2beat/database'
import type { Watched, WatchReader } from '@l2beat/discovery'
import { expect, mockObject } from 'earl'
import { createServer, type Server } from 'http'
import Koa from 'koa'
import type { AddressInfo } from 'net'
import { WatchMonitorController } from './WatchMonitorController'
import { createWatchMonitorRouter } from './WatchMonitorRouter'

describe(createWatchMonitorRouter.name, () => {
  let server: Server | undefined

  afterEach(() => {
    server?.close()
    server = undefined
  })

  async function listen(router: Router): Promise<string> {
    const app = new Koa()
    app.use(router.routes())
    app.use(router.allowedMethods())
    server = createServer(app.callback())
    await new Promise<void>((resolve) =>
      server?.listen(0, '127.0.0.1', resolve),
    )
    const { port } = server.address() as AddressInfo
    return `http://127.0.0.1:${port}`
  }

  function createFixture(readToken: string | undefined) {
    const stored: WatchMonitorRecord[] = [
      {
        name: 'optimism',
        timestamp: 1_700_000_000,
        values: {
          audits: {
            'org/r:a.pdf': { sha: '1', size: 10 },
            'org/r:b.pdf': { sha: '2', size: 20 },
          },
        },
      },
      {
        name: 'quiet',
        timestamp: 1_700_000_000,
        values: { version: '1' },
      },
    ]

    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        getAll: async () => stored,
        findLatest: async (name: string) =>
          stored.find((record) => record.name === name),
      }),
    })

    const locations = [
      { name: 'optimism', kind: 'project' as const, path: '/p/optimism' },
      { name: 'quiet', kind: 'global' as const, path: '/w/quiet' },
    ]
    const reader = mockObject<WatchReader>({
      readAllWatches: () => locations,
      findWatch: (name: string) => locations.find((l) => l.name === name),
      readWatched: (name: string): Watched | undefined =>
        name === 'optimism'
          ? {
              timestamp: 1,
              values: { audits: { 'org/r:a.pdf': { sha: '1', size: 10 } } },
            }
          : { timestamp: 1, values: { version: '1' } },
      readJudgePrompt: (name: string) =>
        name === 'optimism' ? 'Alert on new audit PDFs.' : null,
    })

    const controller = new WatchMonitorController(db, reader)
    return createWatchMonitorRouter(controller, readToken)
  }

  describe('GET /watch/pending', () => {
    it('returns 404 with empty body when WATCH_READ_TOKEN is unset', async () => {
      const url = await listen(createFixture(undefined))
      const res = await fetch(`${url}/watch/pending`)
      expect(res.status).toEqual(404)
      expect(await res.text()).toEqual('')
      expect(res.headers.get('access-control-allow-origin')).toEqual(null)
    })

    it('returns 401 with empty body when authorization header is missing or wrong', async () => {
      const url = await listen(createFixture('top-secret'))

      const missing = await fetch(`${url}/watch/pending`)
      expect(missing.status).toEqual(401)
      expect(await missing.text()).toEqual('')

      const wrong = await fetch(`${url}/watch/pending`, {
        headers: { authorization: 'Bearer wrong-token' },
      })
      expect(wrong.status).toEqual(401)
      expect(await wrong.text()).toEqual('')
    })

    it('returns pending watch diffs and judge prompts when authorized', async () => {
      const url = await listen(createFixture('top-secret'))
      const res = await fetch(`${url}/watch/pending`, {
        headers: { authorization: 'Bearer top-secret' },
      })

      expect(res.status).toEqual(200)
      expect(res.headers.get('access-control-allow-origin')).toEqual(null)
      const body = (await res.json()) as {
        generatedAt: string
        watches: unknown[]
      }
      expect(typeof body.generatedAt).toEqual('string')
      expect(body.watches).toEqual([
        {
          name: 'optimism',
          kind: 'project',
          runTimestamp: 1_700_000_000,
          pendingItems: 0,
          changedPaths: 1,
          judge: 'Alert on new audit PDFs.',
          diff: [
            {
              key: 'audits',
              changes: [
                { path: ['org/r:b.pdf'], after: { sha: '2', size: 20 } },
              ],
            },
          ],
        },
      ])
    })
  })

  describe('GET /status/watch/llms.txt and :watchName.html.md', () => {
    it('renders machine-readable watch index markdown', async () => {
      const url = await listen(createFixture(undefined))
      const res = await fetch(`${url}/status/watch/llms.txt`)

      expect(res.status).toEqual(200)
      expect(res.headers.get('content-type') ?? '').toInclude('text/markdown')
      const text = await res.text()
      expect(text).toInclude('# ETHBEAT Watch Dashboard')
      expect(text).toInclude(
        '- [optimism](/status/watch/optimism.html.md) [project]: 0 pending, 1 changed',
      )
      expect(text).toInclude(
        '- [quiet](/status/watch/quiet.html.md) [global]: No changes',
      )
    })

    it('renders per-watch markdown with diff and judge guidance, and 404s unknown watches', async () => {
      const url = await listen(createFixture(undefined))

      const found = await fetch(`${url}/status/watch/optimism.html.md`)
      expect(found.status).toEqual(200)
      expect(found.headers.get('content-type') ?? '').toInclude('text/markdown')
      const text = await found.text()
      expect(text).toInclude('# optimism')
      expect(text).toInclude('## Changes')
      expect(text).toInclude('+     org/r:b.pdf: {"sha":"2","size":20}')
      expect(text).toInclude('## Judge Guidance')
      expect(text).toInclude('Alert on new audit PDFs.')

      const missing = await fetch(`${url}/status/watch/unknown.html.md`)
      expect(missing.status).toEqual(404)
    })
  })
})
