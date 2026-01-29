import Router from '@koa/router'
import type { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { InteropFeatureConfig } from '../../../../config/Config'
import type { InteropBlockProcessor } from '../capture/InteropBlockProcessor'
import type {
  InteropTransferStream,
  SerializableInteropTransfer,
} from '../stream/InteropTransferStream'
import type { InteropSyncersManager } from '../sync/InteropSyncersManager'
import { renderEventsPage } from './EventsPage'
import { renderMainPage } from './MainPage'
import { renderMessagesPage } from './MessagesPage'
import { renderStatusPage } from './StatusPage'
import { renderTransfersPage } from './TransfersPage'

export function createInteropRouter(
  db: Database,
  config: InteropFeatureConfig,
  processors: InteropBlockProcessor[],
  syncersManager: InteropSyncersManager,
  logger: Logger,
  transferStream: InteropTransferStream,
) {
  const router = new Router()

  router.get('/interop', async (ctx) => {
    const routerStart = performance.now()

    const [events, messages, transfers, missingTokens, uniqueApps] =
      await Promise.all([
        db.interopEvent.getStats(),
        getMessagesStats(db),
        getTransfersStats(db),
        db.interopTransfer.getMissingTokensInfo(),
        db.interopMessage.getUniqueAppsPerPlugin(),
        db.interopPluginSyncedRange.getAll(),
        db.interopPluginSyncState.getAll(),
      ])

    const routerDuration = performance.now() - routerStart

    logger.info('Interop dashboard timings', {
      totalDurationMs: Number(routerDuration.toFixed(2)),
    })

    ctx.body = renderMainPage({
      events,
      messages,
      transfers,
      status: getProcessorsStatus(processors),
      missingTokens,
      uniqueApps,
      pluginSyncStatuses: await syncersManager.getPluginSyncStatuses(),
      getExplorerUrl: config.dashboard.getExplorerUrl,
    })
  })

  router.get('/interop/configs', async (ctx) => {
    const configs = await db.interopConfig.getAllLatest()

    ctx.body = configs
  })

  router.get('/interop/status', async (ctx) => {
    const pluginSyncStatuses = await syncersManager.getPluginSyncStatuses()
    const showResyncControls = ctx.query.showResync !== undefined

    ctx.body = renderStatusPage({ pluginSyncStatuses, showResyncControls })
  })

  router.get('/interop/memory', (ctx) => {
    const memoryUsage = process.memoryUsage()

    ctx.body = {
      rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`, // Resident Set Size - total memory allocated
      heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`, // Total heap size
      heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`, // Actual memory used
      external: `${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB`, // Memory used by C++ objects
      arrayBuffers: `${(memoryUsage.arrayBuffers / 1024 / 1024).toFixed(2)} MB`, // Memory for ArrayBuffers
    }
  })

  router.get('/interop.json', async (ctx) => {
    const events = await db.interopEvent.getStats()
    const messages = await db.interopMessage.getStats()
    ctx.body = { events, messages }
  })

  const Params = v.object({
    kind: v.enum([
      'all',
      'unmatched',
      'unsupported',
      'transfers',
      'matched',
      'old-unmatched',
    ]),
    type: v.string(),
  })

  const ResyncRequest = v.object({
    pluginName: v.string(),
    resyncRequestedFrom: v.record(
      v.string(),
      v.number().check((value) => {
        try {
          UnixTime(value)
          return true
        } catch (error) {
          return error instanceof Error ? error.message : 'Invalid timestamp'
        }
      }),
    ),
  })

  router.post('/interop/resync', async (ctx) => {
    const payload = ResyncRequest.validate(ctx.request.body)
    const { pluginName, resyncRequestedFrom } = payload

    const defaultFrom = resyncRequestedFrom['*']
    const existingChains = (
      await db.interopPluginSyncState.findByPluginName(pluginName)
    ).map((r) => r.chain)

    const updatedChains = new Set<string>()
    await db.transaction(async () => {
      for (const chain of existingChains) {
        const resyncFrom = resyncRequestedFrom[chain] ?? defaultFrom
        if (resyncFrom) {
          await db.interopPluginSyncState.setResyncRequestedFrom(
            pluginName,
            chain,
            resyncFrom,
          )
          updatedChains.add(chain)
        }
      }
    })

    ctx.body = {
      updatedChains: Array.from(updatedChains),
    }
  })

  router.get('/interop/events/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)
    const status = getProcessorsStatus(processors)

    if (params.kind === 'unmatched') {
      const events = await db.interopEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'unsupported') {
      const events = await db.interopEvent.getByType(params.type, {
        unsupported: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'matched') {
      const events = await db.interopEvent.getByType(params.type, {
        matched: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'old-unmatched') {
      const now = new Date()
      const cutoffTime = new Date(now.toISOString())
      cutoffTime.setUTCHours(cutoffTime.getUTCHours() - 2)

      const events = await db.interopEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
        oldCutoff: UnixTime.fromDate(cutoffTime),
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'all') {
      const events = await db.interopEvent.getByType(params.type)
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    }
  })

  router.get('/interop/messages/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)
    const messages = await db.interopMessage.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderMessagesPage({
      messages,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  router.get('/interop/transfers/stream', (ctx) => {
    ctx.set('Content-Type', 'text/event-stream')
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Connection', 'keep-alive')
    ctx.set('X-Accel-Buffering', 'no')
    ctx.status = 200
    ctx.compress = false
    ctx.respond = false

    ctx.res.write(':\n\n')

    const write = (payload: SerializableInteropTransfer[]) => {
      ctx.res.write(`data: ${JSON.stringify(payload)}\n\n`)
    }

    const unsubscribe = transferStream.subscribe(write, { replay: 20 })

    const heartbeat = setInterval(() => {
      ctx.res.write(':\n\n')
    }, 15_000)

    const close = () => {
      clearInterval(heartbeat)
      unsubscribe()
    }

    ctx.req.on('close', close)
    ctx.req.on('end', close)
  })

  router.get('/interop/transfers/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)

    const transfers = await db.interopTransfer.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderTransfersPage({
      transfers,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  return router
}

function getProcessorsStatus(processors: InteropBlockProcessor[]) {
  return processors.flatMap((p) =>
    p.lastProcessed
      ? [
          {
            chain: p.chain,
            block: p.lastProcessed.number,
            timestamp: p.lastProcessed.timestamp,
          },
        ]
      : [],
  )
}

async function getMessagesStats(db: Database) {
  const stats = await db.interopMessage.getStats()
  const detailedStats = await db.interopMessage.getDetailedStats()

  return stats.map((overall) => ({
    plugin: overall.plugin,
    type: overall.type,
    count: Number(overall.count),
    avgDuration: Number(overall.avgDuration),
    knownAppCount: Number(overall.knownAppCount),
    chains: detailedStats
      .filter(
        (chain) =>
          chain.plugin === overall.plugin && chain.type === overall.type,
      )
      .map((chain) => {
        assert(chain.srcChain && chain.dstChain)
        return {
          plugin: chain.plugin,
          type: chain.type,
          srcChain: chain.srcChain,
          dstChain: chain.dstChain,
          count: Number(chain.count),
          avgDuration: Number(chain.avgDuration),
        }
      }),
  }))
}

async function getTransfersStats(db: Database) {
  const stats = await db.interopTransfer.getStats()
  const detailedStats = await db.interopTransfer.getDetailedStats()

  return stats.map((overall) => ({
    plugin: overall.plugin,
    type: overall.type,
    count: overall.count,
    avgDuration: overall.avgDuration,
    srcValueSum: overall.srcValueSum,
    dstValueSum: overall.dstValueSum,
    chains: detailedStats.filter(
      (chain) => chain.plugin === overall.plugin && chain.type === overall.type,
    ),
  }))
}
