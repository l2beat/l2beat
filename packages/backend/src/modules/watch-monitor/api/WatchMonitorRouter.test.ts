import type Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import type { Database, WatchMonitorRecord } from '@l2beat/database'
import type { Watched, WatchReader } from '@l2beat/discovery'
import { expect, mockFn, mockObject } from 'earl'
import { createServer, type Server } from 'http'
import Koa from 'koa'
import type { AddressInfo } from 'net'
import { ApiServer } from '../../../api/ApiServer'
import { WatchMonitorController } from './WatchMonitorController'
import { createWatchMonitorRouter } from './WatchMonitorRouter'

function record(
  partial: Partial<WatchMonitorRecord> & Pick<WatchMonitorRecord, 'name'>,
): WatchMonitorRecord {
  return {
    timestamp: null,
    values: null,
    notifiedValues: null,
    lastAttemptAt: null,
    lastError: null,
    ...partial,
  }
}

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
      record({
        name: 'optimism',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        values: {
          audits: {
            'org/r:a.pdf': { sha: '1', size: 10 },
            'org/r:b.pdf': { sha: '2', size: 20 },
          },
        },
      }),
      record({
        name: 'private-repo',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        values: {
          audits: {
            'private/repo:secret-audit.pdf': { sha: '9', size: 99 },
          },
        },
      }),
      record({
        name: 'quiet',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        values: { version: '1' },
      }),
      record({
        name: 'stale-watch',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_003_600,
        lastError: 'HTTP timeout',
        values: { version: '1' },
      }),
      record({
        name: 'failed-watch',
        lastAttemptAt: 1_700_003_600,
        lastError: 'GitHub tree truncated',
      }),
    ]

    const db = mockObject<Database>({
      watchMonitor: mockObject<Database['watchMonitor']>({
        getAll: async () => stored,
        findLatest: async (name: string) =>
          stored.find((entry) => entry.name === name),
      }),
    })

    const locations = [
      { name: 'disabled-watch', kind: 'project' as const, path: '/p/disabled' },
      { name: 'failed-watch', kind: 'project' as const, path: '/p/failed' },
      { name: 'never-ran', kind: 'project' as const, path: '/p/never-ran' },
      { name: 'optimism', kind: 'project' as const, path: '/p/optimism' },
      { name: 'private-repo', kind: 'project' as const, path: '/p/private' },
      { name: 'quiet', kind: 'global' as const, path: '/w/quiet' },
      { name: 'stale-watch', kind: 'project' as const, path: '/p/stale' },
    ]
    const reader = mockObject<WatchReader>({
      readAllWatches: () => locations,
      findWatch: (name: string) => locations.find((l) => l.name === name),
      isPublic: (name: string) => name !== 'private-repo',
      readWatched: (name: string): Watched | undefined => {
        if (name === 'optimism') {
          return {
            timestamp: 1,
            values: { audits: { 'org/r:a.pdf': { sha: '1', size: 10 } } },
          }
        }
        if (name === 'quiet' || name === 'stale-watch') {
          return { timestamp: 1, values: { version: '1' } }
        }
        return undefined
      },
      readJudgePrompt: (name: string) =>
        name === 'optimism' ? 'Alert on new audit PDFs.' : null,
    })

    const controller = new WatchMonitorController(db, reader, [
      'disabled-watch',
    ])
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

    it('returns all pending watches (including private) and failed watches when authorized', async () => {
      const url = await listen(createFixture('top-secret'))
      const res = await fetch(`${url}/watch/pending`, {
        headers: { authorization: 'Bearer top-secret' },
      })

      expect(res.status).toEqual(200)
      expect(res.headers.get('access-control-allow-origin')).toEqual(null)
      const body = (await res.json()) as {
        generatedAt: string
        watches: { name: string }[]
        failedWatches: {
          name: string
          kind: 'project' | 'global'
          lastAttemptAt: number | null
          lastSuccessAt: number | null
          lastError: string
        }[]
      }
      expect(typeof body.generatedAt).toEqual('string')
      expect(body.watches.map((w) => w.name)).toEqual([
        'optimism',
        'private-repo',
      ])
      expect(body.failedWatches).toEqual([
        {
          name: 'failed-watch',
          kind: 'project',
          lastAttemptAt: 1_700_003_600,
          lastSuccessAt: null,
          lastError: 'GitHub tree truncated',
        },
        {
          name: 'stale-watch',
          kind: 'project',
          lastAttemptAt: 1_700_003_600,
          lastSuccessAt: 1_700_000_000,
          lastError: 'HTTP timeout',
        },
      ])
    })

    it('never logs the bearer token when an authenticated request fails through ApiServer', async () => {
      const secret = 'super-secret-watch-read-token-12345'
      const errorLog = mockFn(() => undefined)
      const infoLog = mockFn(() => undefined)
      const logger = mockObject<Logger>({
        info: infoLog,
        error: errorLog,
      })
      logger.for = mockFn<Logger['for']>(() => logger)

      const failingDb = mockObject<Database>({
        watchMonitor: mockObject<Database['watchMonitor']>({
          getAll: async () => {
            throw new Error('DB connection lost')
          },
        }),
      })
      const reader = mockObject<WatchReader>({
        readAllWatches: () => [],
      })
      const router = createWatchMonitorRouter(
        new WatchMonitorController(failingDb, reader),
        secret,
      )
      const apiServer = new ApiServer(0, logger, [router])
      server = createServer(apiServer.getNodeCallback())
      await new Promise<void>((resolve) =>
        server?.listen(0, '127.0.0.1', resolve),
      )
      const { port } = server.address() as AddressInfo

      const res = await fetch(`http://127.0.0.1:${port}/watch/pending`, {
        headers: { authorization: `Bearer ${secret}` },
      })
      expect(res.status).toEqual(500)
      expect(errorLog).toHaveBeenCalledTimes(1)
      expect(JSON.stringify(errorLog.calls)).not.toInclude(secret)
      expect(JSON.stringify(infoLog.calls)).not.toInclude(secret)
    })
  })

  describe('GET /status/watch/llms.txt and :watchName.html.md', () => {
    it('publishes only public watches and distinguishes errors, never-run, disabled, and clean runs', async () => {
      const url = await listen(createFixture(undefined))
      const res = await fetch(`${url}/status/watch/llms.txt`)

      expect(res.status).toEqual(200)
      expect(res.headers.get('content-type') ?? '').toInclude('text/markdown')
      const text = await res.text()
      expect(text).toInclude('# ETHBEAT Watch Dashboard')
      expect(text).not.toInclude('private-repo')
      expect(text).toInclude(
        '- [failed-watch](/status/watch/failed-watch.html.md) [project]: Failed (no successful run) (never succeeded)',
      )
      expect(text).toInclude(
        '- [stale-watch](/status/watch/stale-watch.html.md) [project]: Stale (last run failed) (last success 2023-11-14T22:13:20.000Z)',
      )
      expect(text).toInclude(
        '- [optimism](/status/watch/optimism.html.md) [project]: 0 pending, 1 changed (last run 2023-11-14T22:13:20.000Z)',
      )
      expect(text).toInclude(
        '- [disabled-watch](/status/watch/disabled-watch.html.md) [project]: Disabled',
      )
      expect(text).toInclude(
        '- [never-ran](/status/watch/never-ran.html.md) [project]: Not yet run',
      )
      expect(text).toInclude(
        '- [quiet](/status/watch/quiet.html.md) [global]: No changes (last run 2023-11-14T22:13:20.000Z)',
      )
    })

    it('renders public per-watch markdown and 404s private or unknown watches', async () => {
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

      const privateWatch = await fetch(
        `${url}/status/watch/private-repo.html.md`,
      )
      expect(privateWatch.status).toEqual(404)

      const missing = await fetch(`${url}/status/watch/unknown.html.md`)
      expect(missing.status).toEqual(404)
    })
  })
})
