import Router from '@koa/router'
import type { Database } from '@l2beat/database'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { BridgesConfig } from '../../config/Config'
import type { BridgeBlockProcessor } from './BridgeBlockProcessor'
import { renderEventsPage } from './dashboard/EventsPage'
import { renderMainPage } from './dashboard/MainPage'
import { renderMessagesPage } from './dashboard/MessagesPage'
import { renderTransfersPage } from './dashboard/TransfersPage'

export function createBridgeRouter(
  db: Database,
  config: BridgesConfig,
  processors: BridgeBlockProcessor[],
) {
  const router = new Router()

  router.get('/bridges', async (ctx) => {
    const events = await db.bridgeEvent.getStats()
    const messages = await getMessagesStats(db)
    const transfers = await getTransfersStats(db)
    const status = getProcessorsStatus(processors)

    ctx.body = renderMainPage({
      events,
      messages,
      transfers,
      status,
    })
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

  router.get('/bridges/events/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)
    const status = getProcessorsStatus(processors)

    if (params.kind === 'unmatched') {
      const events = await db.bridgeEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'unsupported') {
      const events = await db.bridgeEvent.getByType(params.type, {
        unsupported: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    } else if (params.kind === 'matched') {
      const events = await db.bridgeEvent.getByType(params.type, {
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

      const events = await db.bridgeEvent.getByType(params.type, {
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
      const events = await db.bridgeEvent.getByType(params.type)
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
        status,
      })
    }
  })

  router.get('/bridges/messages/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)
    const messages = await db.bridgeMessage.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderMessagesPage({
      messages,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  router.get('/bridges/transfers/:type', async (ctx) => {
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const query = v
      .object({
        srcChain: v.string().optional(),
        dstChain: v.string().optional(),
      })
      .validate(ctx.query)
    const status = getProcessorsStatus(processors)

    const transfers = await db.bridgeTransfer.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderTransfersPage({
      transfers,
      getExplorerUrl: config.dashboard.getExplorerUrl,
      status,
    })
  })

  router.get('/bridges/csv/transfers/:type', async (ctx) => {
    console.log(ctx.params)
    const params = v.object({ type: v.string() }).validate(ctx.params)
    const transfers = await db.bridgeTransfer.getByType(params.type)

    ctx.body =
      'durationMs,srcValueUsd,dstValueUsd,srcChain,srcTxHash,dstChain,dstTxHash\n' +
      transfers
        .map((t) =>
          [
            t.duration,
            t.srcValueUsd,
            t.dstValueUsd,
            t.srcChain,
            t.srcTxHash,
            t.dstChain,
            t.dstTxHash,
          ].join(','),
        )
        .join('\n')
  })

  return router
}

function getProcessorsStatus(processors: BridgeBlockProcessor[]) {
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
  const stats = await db.bridgeMessage.getStats()
  const detailedStats = await db.bridgeMessage.getDetailedStats()

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
  const stats = await db.bridgeTransfer.getStats()
  const detailedStats = await db.bridgeTransfer.getDetailedStats()

  return stats.map((overall) => ({
    type: overall.type,
    count: overall.count,
    medianDuration: overall.medianDuration,
    srcValueSum: overall.srcValueSum,
    dstValueSum: overall.dstValueSum,
    chains: detailedStats.filter((chain) => chain.type === overall.type),
  }))
}
