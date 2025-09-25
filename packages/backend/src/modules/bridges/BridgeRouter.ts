import Router from '@koa/router'
import type { Database } from '@l2beat/database'
import { v } from '@l2beat/validate'
import type { BridgesConfig } from '../../config/Config'
import { renderEventsPage } from './dashboard/EventsPage'
import { renderMainPage } from './dashboard/MainPage'
import { renderMessagesPage } from './dashboard/MessagesPage'
import { renderTransfersPage } from './dashboard/TransfersPage'

export function createBridgeRouter(db: Database, config: BridgesConfig) {
  const router = new Router()

  router.get('/bridges', async (ctx) => {
    const events = await db.bridgeEvent.getStats()
    const messages = await db.bridgeMessage.getStats()
    const transfers = await db.bridgeTransfer.getStats()
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
      'messages',
      'transfers',
      'matched',
      'old-unmatched',
    ]),
    type: v.string(),
  })

  router.get('/bridges/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)
    if (params.kind === 'messages') {
      const messages = await db.bridgeMessage.getByType(params.type)
      ctx.body = renderMessagesPage({
        messages,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    } else if (params.kind === 'transfers') {
      const transfers = await db.bridgeTransfer.getByType(params.type)
      ctx.body = renderTransfersPage({
        transfers,
        getExplorerUrl: config.dashboard.getExplorerUrl,
      })
    } else {
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
    }
  })

  return router
}
