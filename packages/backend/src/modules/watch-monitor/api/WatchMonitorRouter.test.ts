import type Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import type { Database, WatchMonitorRecord } from '@l2beat/database'
import {
  hashWatchConfig,
  type WatchConfig,
  type Watched,
  type WatchReader,
} from '@l2beat/discovery'
import { expect, mockFn, mockObject } from 'earl'
import { createServer, type Server } from 'http'
import Koa from 'koa'
import type { AddressInfo } from 'net'
import { ApiServer } from '../../../api/ApiServer'
import { WatchMonitorController } from './WatchMonitorController'
import { createWatchMonitorRouter } from './WatchMonitorRouter'

function watchConfig(name: string, isPublic: boolean): WatchConfig {
  return { name, isPublic, watches: [] }
}

function record(
  partial: Partial<WatchMonitorRecord> & Pick<WatchMonitorRecord, 'name'>,
): WatchMonitorRecord {
  return {
    timestamp: null,
    values: null,
    isPublic: false,
    configHash: null,
    pendingNotifications: [],
    lastAttemptAt: null,
    lastAttemptId: null,
    lastAttemptConfigHash: null,
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
    const configs = new Map<string, WatchConfig>([
      ['disabled-watch', watchConfig('disabled-watch', true)],
      ['failed-watch', watchConfig('failed-watch', true)],
      ['never-ran', watchConfig('never-ran', true)],
      ['newly-public', watchConfig('newly-public', true)],
      [
        'newly-public-failed-private',
        watchConfig('newly-public-failed-private', true),
      ],
      ['optimism', watchConfig('optimism', true)],
      ['private-repo', watchConfig('private-repo', false)],
      ['quiet', watchConfig('quiet', true)],
      ['repointed-public', watchConfig('repointed-public', true)],
      ['stale-watch', watchConfig('stale-watch', true)],
    ])
    const hashOf = (name: string) => {
      const cfg = configs.get(name)
      if (cfg === undefined) {
        throw new Error('Missing fixture config')
      }
      return hashWatchConfig(cfg)
    }

    const stored: WatchMonitorRecord[] = [
      record({
        name: 'optimism',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        lastAttemptConfigHash: hashOf('optimism'),
        isPublic: true,
        configHash: hashOf('optimism'),
        values: {
          audits: {
            'org/r:a.pdf': { sha: '1', size: 10 },
            'org/r:b.pdf': { sha: '2', size: 20 },
          },
        },
      }),
      // Captured earlier while private (including a private error diagnostic);
      // watch.jsonc has since switched to public: true.
      record({
        name: 'newly-public',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        lastAttemptConfigHash: hashWatchConfig(
          watchConfig('newly-public', false),
        ),
        lastError: '401 private-org/secret-repo',
        isPublic: false,
        configHash: hashWatchConfig(watchConfig('newly-public', false)),
        values: {
          audits: {
            'private/repo:leaked-secret.pdf': { sha: '999', size: 42 },
          },
        },
      }),
      // Failure-only row recorded while private; watch.jsonc has since
      // switched to public: true. Must not surface as Failed or leak timestamp.
      record({
        name: 'newly-public-failed-private',
        lastAttemptAt: 1_700_003_600,
        lastAttemptConfigHash: hashWatchConfig(
          watchConfig('newly-public-failed-private', false),
        ),
        lastError: '403 private-org/secret-repo',
      }),
      record({
        name: 'private-repo',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        lastAttemptConfigHash: hashOf('private-repo'),
        isPublic: false,
        configHash: hashOf('private-repo'),
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
        lastAttemptConfigHash: hashOf('quiet'),
        isPublic: true,
        configHash: hashOf('quiet'),
        values: { version: '1' },
      }),
      // Fresh public run after repointing from a private repo, while watched.json
      // on disk still holds the earlier private baseline.
      record({
        name: 'repointed-public',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_000_000,
        lastAttemptConfigHash: hashOf('repointed-public'),
        isPublic: true,
        configHash: hashOf('repointed-public'),
        values: {
          audits: {
            'public/repo:new.pdf': { sha: '1', size: 10 },
          },
        },
      }),
      record({
        name: 'stale-watch',
        timestamp: 1_700_000_000,
        lastAttemptAt: 1_700_003_600,
        lastAttemptConfigHash: hashOf('stale-watch'),
        lastError: 'HTTP timeout',
        isPublic: true,
        configHash: hashOf('stale-watch'),
        values: { version: '1' },
      }),
      record({
        name: 'failed-watch',
        lastAttemptAt: 1_700_003_600,
        lastAttemptConfigHash: hashOf('failed-watch'),
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
      { name: 'newly-public', kind: 'project' as const, path: '/p/newly-pub' },
      {
        name: 'newly-public-failed-private',
        kind: 'project' as const,
        path: '/p/newly-pub-failed',
      },
      { name: 'optimism', kind: 'project' as const, path: '/p/optimism' },
      { name: 'private-repo', kind: 'project' as const, path: '/p/private' },
      { name: 'quiet', kind: 'global' as const, path: '/w/quiet' },
      {
        name: 'repointed-public',
        kind: 'project' as const,
        path: '/p/repointed',
      },
      { name: 'stale-watch', kind: 'project' as const, path: '/p/stale' },
    ]
    const reader = mockObject<WatchReader>({
      readAllWatches: () => locations,
      findWatch: (name: string) => locations.find((l) => l.name === name),
      readWatchConfig: (name: string) => {
        const cfg = configs.get(name)
        if (cfg === undefined) {
          throw new Error('Watch not found')
        }
        return cfg
      },
      readWatched: (name: string): Watched | undefined => {
        if (name === 'optimism') {
          return {
            timestamp: 1,
            configHash: hashOf('optimism'),
            values: { audits: { 'org/r:a.pdf': { sha: '1', size: 10 } } },
          }
        }
        if (name === 'quiet' || name === 'stale-watch') {
          return {
            timestamp: 1,
            configHash: hashOf(name),
            values: { version: '1' },
          }
        }
        if (name === 'repointed-public') {
          return {
            timestamp: 1,
            configHash: hashWatchConfig(watchConfig('repointed-public', false)),
            values: {
              audits: {
                'private-org/secret-baseline:old.pdf': { sha: '9', size: 99 },
              },
            },
          }
        }
        return undefined
      },
      readJudgePrompt: (name: string) => {
        if (name === 'optimism') {
          return 'Alert on new audit PDFs.'
        }
        if (name === 'newly-public') {
          return 'Internal triage note for private-org/secret-repo.'
        }
        return null
      },
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
        watches: { name: string; judge: string | null }[]
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
        'repointed-public',
      ])
      expect(body.watches.find((w) => w.name === 'optimism')?.judge).toEqual(
        'Alert on new audit PDFs.',
      )
      expect(body.failedWatches).toEqual([
        {
          name: 'failed-watch',
          kind: 'project',
          lastAttemptAt: 1_700_003_600,
          lastSuccessAt: null,
          lastError: 'GitHub tree truncated',
        },
        {
          name: 'newly-public',
          kind: 'project',
          lastAttemptAt: null,
          lastSuccessAt: null,
          lastError:
            'Stored watch snapshot is stale (watch.jsonc changed); awaiting refresh',
        },
        {
          name: 'newly-public-failed-private',
          kind: 'project',
          lastAttemptAt: null,
          lastSuccessAt: null,
          lastError:
            'Stored watch snapshot is stale (watch.jsonc changed); awaiting refresh',
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
    it('publishes only public watches and hides snapshots captured before switching to public', async () => {
      const url = await listen(createFixture(undefined))
      const res = await fetch(`${url}/status/watch/llms.txt`)

      expect(res.status).toEqual(200)
      expect(res.headers.get('content-type') ?? '').toInclude('text/markdown')
      const text = await res.text()
      expect(text).toInclude('# ETHBEAT Watch Dashboard')
      expect(text).not.toInclude('private-repo')
      expect(text).not.toInclude('leaked-secret.pdf')
      expect(text).toInclude(
        '- [newly-public](/status/watch/newly-public.html.md) [project]: Not yet run',
      )
      expect(text).toInclude(
        '- [newly-public-failed-private](/status/watch/newly-public-failed-private.html.md) [project]: Not yet run',
      )
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

    it('renders public per-watch markdown, hides older private snapshots, and 404s private or unknown watches', async () => {
      const url = await listen(createFixture(undefined))

      const found = await fetch(`${url}/status/watch/optimism.html.md`)
      expect(found.status).toEqual(200)
      expect(found.headers.get('content-type') ?? '').toInclude('text/markdown')
      const text = await found.text()
      expect(text).toInclude('# optimism')
      expect(text).toInclude('## Changes')
      expect(text).toInclude('+     org/r:b.pdf: {"sha":"2","size":20}')
      // Judge prompts stay behind authenticated /watch/pending, never public markdown.
      expect(text).not.toInclude('## Judge Guidance')
      expect(text).not.toInclude('Alert on new audit PDFs.')

      // Watch switched from private -> public before a fresh public run:
      // must NOT leak the previous private snapshot's files, diff, raw error, or judge.md.
      const newlyPublic = await fetch(
        `${url}/status/watch/newly-public.html.md`,
      )
      expect(newlyPublic.status).toEqual(200)
      const newlyPublicText = await newlyPublic.text()
      expect(newlyPublicText).toInclude('- **Status**: Not yet run')
      expect(newlyPublicText).toInclude('- **Last attempt**: Never')
      expect(newlyPublicText).not.toInclude('leaked-secret.pdf')
      expect(newlyPublicText).not.toInclude('private-org/secret-repo')
      expect(newlyPublicText).not.toInclude('Internal triage note')
      expect(newlyPublicText).not.toInclude('## Judge Guidance')
      expect(newlyPublicText).not.toInclude('## Changes')

      // Failure-only row recorded while private must NOT surface as Failed or
      // leak the private attempt timestamp after switching to public: true.
      const newlyPublicFailed = await fetch(
        `${url}/status/watch/newly-public-failed-private.html.md`,
      )
      expect(newlyPublicFailed.status).toEqual(200)
      const newlyPublicFailedText = await newlyPublicFailed.text()
      expect(newlyPublicFailedText).toInclude('- **Status**: Not yet run')
      expect(newlyPublicFailedText).toInclude(
        '- **Last successful run**: Never',
      )
      expect(newlyPublicFailedText).toInclude('- **Last attempt**: Never')
      expect(newlyPublicFailedText).not.toInclude('Failed')
      expect(newlyPublicFailedText).not.toInclude('2023-11-14T23:13:20.000Z')
      expect(newlyPublicFailedText).not.toInclude('private-org/secret-repo')

      // Public watch with a failed latest run shows generic status only, not raw error.
      const stale = await fetch(`${url}/status/watch/stale-watch.html.md`)
      expect(stale.status).toEqual(200)
      const staleText = await stale.text()
      expect(staleText).toInclude('- **Status**: Stale (last run failed)')
      expect(staleText).not.toInclude('HTTP timeout')
      expect(staleText).not.toInclude('Last error')

      // Repointed watch that ran under its new public config while watched.json
      // still holds an older private baseline must NOT leak private removals.
      const repointed = await fetch(
        `${url}/status/watch/repointed-public.html.md`,
      )
      expect(repointed.status).toEqual(200)
      const repointedText = await repointed.text()
      expect(repointedText).toInclude('public/repo:new.pdf')
      expect(repointedText).not.toInclude('private-org/secret-baseline')
      expect(repointedText).not.toInclude('old.pdf')

      const privateWatch = await fetch(
        `${url}/status/watch/private-repo.html.md`,
      )
      expect(privateWatch.status).toEqual(404)

      const missing = await fetch(`${url}/status/watch/unknown.html.md`)
      expect(missing.status).toEqual(404)
    })
  })
})
