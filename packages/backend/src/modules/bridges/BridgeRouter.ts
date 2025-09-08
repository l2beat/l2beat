import Router from '@koa/router'
// import { v } from '@l2beat/validate'
import type { BridgeMatcher } from './BridgeMatcher'

export function createBridgeRouter(bridgeMatcher: BridgeMatcher) {
  const router = new Router()

  // router.get('/bridges', (ctx) => {
  //   const json = bridgeMatcher.getStats()
  //   ctx.body = statsToHtml(json)
  // })

  // router.get('/bridges.json', (ctx) => {
  //   const json = bridgeMatcher.getStats()
  //   ctx.body = json
  // })

  // const Params = v.object({
  //   kind: v.enum(['all', 'unmatched', 'messages', 'transfers']),
  //   type: v.string(),
  // })

  // router.get('/bridges/:kind/:type', (ctx) => {
  //   const params = Params.validate(ctx.params)
  //   const json = bridgeMatcher.getByType(params.kind, params.type)§
  //   ctx.body = json
  // })

  return router
}

// function statsToHtml(
//   stats: ReturnType<typeof BridgeMatcher.prototype.getStats>,
// ) {
//   function entries(kind: string, stats: Record<string, number>) {
//     function entry(kind: string, type: string, count: number) {
//       return `
//       <li>
//         <a href="/bridges/${kind}/${type}">${type}</a>: ${count}
//       </li>
//     `
//     }

//     const objectEntries = Object.entries(stats)
//     if (objectEntries.length === 0) {
//       return ''
//     }

//     return `
//     <h2>${kind}</h2>
//     <ul>
//       ${objectEntries.map(([type, count]) => entry(kind, type, count)).join('')}
//     </ul>
//   `
//   }
//   return `
//     <!doctype html>
//     <html>
//     <head>
//       <title>Bridge Stats</title>
//     </head>
//     <body>
//       <h1>Bridge Stats</h1>
//       ${entries('unmatched', stats.unmatched)}
//       ${entries('messages', stats.messages)}
//       ${entries('transfers', stats.transfers)}
//       ${entries('all', stats.all)}
//     </body>
//     </html>
// `
// }
