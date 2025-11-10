import Router from '@koa/router'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { InteropFeatureConfig } from '../../../../config/Config'
import type { InteropBlockProcessor } from '../capture/InteropBlockProcessor'
import { renderEventsPage } from './EventsPage'
import { renderMainPage } from './MainPage'
import { renderMessagesPage } from './MessagesPage'
import { renderTransfersPage } from './TransfersPage'

export function createInteropRouter(
  db: Database,
  config: InteropFeatureConfig,
  processors: InteropBlockProcessor[],
) {
  const router = new Router()

  router.get('/interop', async (ctx) => {
    const events = await db.interopEvent.getStats()
    const messages = await getMessagesStats(db)
    const transfers = await getTransfersStats(db)
    const status = getProcessorsStatus(processors)
    const missingTokens = await db.interopTransfer.getMissingTokensInfo()

    ctx.body = renderMainPage({
      events,
      messages,
      transfers,
      status,
      missingTokens,
      getExplorerUrl: config.dashboard.getExplorerUrl,
    })
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
    type: overall.type,
    count: Number(overall.count),
    medianDuration: Number(overall.medianDuration),
    knownAppCount: Number(overall.knownAppCount),
    knownApps: overall.knownApps,
    chains: detailedStats
      .filter((chain) => chain.type === overall.type)
      .map((chain) => {
        assert(chain.srcChain && chain.dstChain)
        return {
          type: chain.type,
          srcChain: chain.srcChain,
          dstChain: chain.dstChain,
          count: Number(chain.count),
          medianDuration: Number(chain.medianDuration),
        }
      }),
  }))
}

async function getTransfersStats(db: Database) {
  const stats = await db.interopTransfer.getStats()
  const detailedStats = await db.interopTransfer.getDetailedStats()

  return stats.map((overall) => ({
    type: overall.type,
    count: overall.count,
    medianDuration: overall.medianDuration,
    srcValueSum: overall.srcValueSum,
    dstValueSum: overall.dstValueSum,
    chains: detailedStats.filter((chain) => chain.type === overall.type),
  }))
}
