import Router from '@koa/router'
import type { Database } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { BridgesConfig } from '../../config/Config'
import { renderEventsPage } from './dashboard/EventsPage'
import { renderMainPage } from './dashboard/MainPage'
import { renderMessagesPage } from './dashboard/MessagesPage'

export function createBridgeRouter(db: Database, config: BridgesConfig) {
  const router = new Router()

  router.get('/bridges', async (ctx) => {
    const events = await db.bridgeEvent.getStats()
    const messages = await getMessagesStats(db)
    const transfers = await getTransfersStats(db)
    ctx.body = renderMainPage({
      events,
      messages,
      transfers,
    })
  })

  router.get('/bridges.json', async (ctx) => {
    const events = await db.bridgeEvent.getStats()
    const messages = await db.bridgeMessage.getStats()
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

  router.get('/bridges/events/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)

    if (params.kind === 'unmatched') {
      const events = await db.bridgeEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    } else if (params.kind === 'unsupported') {
      const events = await db.bridgeEvent.getByType(params.type, {
        unsupported: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    } else if (params.kind === 'matched') {
      const events = await db.bridgeEvent.getByType(params.type, {
        matched: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    } else if (params.kind === 'old-unmatched') {
      const events = await db.bridgeEvent.getByType(params.type, {
        matched: false,
        unsupported: false,
        olderThanTwoHours: true,
      })
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    } else if (params.kind === 'all') {
      const events = await db.bridgeEvent.getByType(params.type)
      ctx.body = renderEventsPage({
        events,
        getExplorerUrl: config.dashboard.getExplorerUrl,
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
    const messages = await db.bridgeMessage.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderMessagesPage({
      messages,
      getExplorerUrl: config.dashboard.getExplorerUrl,
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
    const messages = await db.bridgeTransfer.getByType(params.type, {
      srcChain: query.srcChain,
      dstChain: query.dstChain,
    })
    ctx.body = renderMessagesPage({
      messages,
      getExplorerUrl: config.dashboard.getExplorerUrl,
    })
  })

  return router
}

async function getMessagesStats(db: Database) {
  const stats = await db.bridgeMessage.getStats()
  const detailedStats = await db.bridgeMessage.getDetailedStats()

  return stats.map((overall) => ({
    type: overall.type,
    count: Number(overall.count),
    medianDuration: Number(overall.medianDuration),
    chains: detailedStats
      .filter((chain) => chain.type === overall.type)
      .map((chain) => {
        assert(chain.sourceChain && chain.destinationChain)
        return {
          type: chain.type,
          sourceChain: chain.sourceChain,
          destinationChain: chain.destinationChain,
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
    count: Number(overall.count),
    medianDuration: Number(overall.medianDuration),
    outboundValueSum: Number(overall.outboundValueSum),
    inboundValueSum: Number(overall.inboundValueSum),
    chains: detailedStats
      .filter((chain) => chain.type === overall.type)
      .map((chain) => {
        assert(chain.sourceChain && chain.destinationChain)
        return {
          type: chain.type,
          sourceChain: chain.sourceChain,
          destinationChain: chain.destinationChain,
          count: Number(chain.count),
          medianDuration: Number(chain.medianDuration),
          outboundValueSum: Number(chain.outboundValueSum),
          inboundValueSum: Number(chain.inboundValueSum),
        }
      }),
  }))
}
