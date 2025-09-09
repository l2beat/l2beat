import Router from '@koa/router'
import type {
  BridgeEventStatsRecord,
  BridgeMessageStatsRecord,
  Database,
} from '@l2beat/database'
import { v } from '@l2beat/validate'

export function createBridgeRouter(db: Database) {
  const router = new Router()

  router.get('/bridges', async (ctx) => {
    const events = await db.bridgeEvent.getStats()
    const messages = await db.bridgeMessage.getStats()
    ctx.body = statsToHtml(events, messages)
  })

  router.get('/bridges.json', async (ctx) => {
    const events = await db.bridgeEvent.getStats()
    const messages = await db.bridgeMessage.getStats()
    ctx.body = { events, messages }
  })

  const Params = v.object({
    kind: v.enum(['all', 'unmatched', 'messages']),
    type: v.string(),
  })

  router.get('/bridges/:kind/:type', async (ctx) => {
    const params = Params.validate(ctx.params)
    if (params.kind === 'messages') {
      const messages = await db.bridgeMessage.getByType(params.type)
      ctx.body = messages
    } else {
      let events = await db.bridgeEvent.getByType(params.type)
      if (params.kind === 'unmatched') {
        events = events.filter((x) => !x.matched)
      }
      ctx.body = events
    }
  })

  return router
}

function statsToHtml(
  events: BridgeEventStatsRecord[],
  messages: BridgeMessageStatsRecord[],
) {
  let html = '<!doctype html>'
  html += '<html>'
  html += '<head>'
  html += '<title>Bridge Stats</title>'
  html += '</head>'
  html += '</body>'
  html += '<h1>Bridge Stats</h1>'

  html += '<h2>Unmatched events</h2>'
  html += '<ul>'
  for (const { type, count, matched } of events) {
    const unmatched = count - matched
    if (unmatched !== 0) {
      html += `<li><a href="/bridges/unmatched/${type}">${type}</a>: ${unmatched}</li>`
    }
  }
  html += '</ul>'

  html += '<h2>All events</h2>'
  html += '<ul>'
  for (const { type, count } of events) {
    html += `<li><a href="/bridges/all/${type}">${type}</a>: ${count}</li>`
  }
  html += '</ul>'

  html += '<h2>Messages</h2>'
  html += '<ul>'
  for (const { type, count, averageDuration } of messages) {
    html += `<li><a href="/bridges/messages/${type}">${type}</a>: ${count}, avg = ${averageDuration} seconds</li>`
  }
  html += '</ul>'

  html += '</body>'
  return html
}
