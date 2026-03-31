import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { publicProcedure } from '../procedures'
import { router } from '../trpc'

const InteropEventDetailsRequest = v.object({
  kind: v.enum(['all', 'matched', 'unmatched', 'old-unmatched', 'unsupported']),
  type: v.string(),
})
type InteropEventKind = v.infer<typeof InteropEventDetailsRequest>['kind']

async function getInteropEventDetails(
  db: Database,
  kind: InteropEventKind,
  type: string,
) {
  let events

  if (kind === 'matched') {
    events = await db.interopEvent.getByType(type, { matched: true })
  } else if (kind === 'unmatched') {
    events = await db.interopEvent.getByType(type, {
      matched: false,
      unsupported: false,
    })
  } else if (kind === 'unsupported') {
    events = await db.interopEvent.getByType(type, { unsupported: true })
  } else if (kind === 'old-unmatched') {
    const now = new Date()
    const cutoffTime = new Date(now.toISOString())
    cutoffTime.setUTCHours(cutoffTime.getUTCHours() - 2)

    events = await db.interopEvent.getByType(type, {
      matched: false,
      unsupported: false,
      oldCutoff: UnixTime.fromDate(cutoffTime),
    })
  } else {
    events = await db.interopEvent.getByType(type)
  }

  return events.map((event) => {
    const srcChain = (event.args as { $srcChain?: string }).$srcChain
    const dstChain = (event.args as { $dstChain?: string }).$dstChain

    return {
      plugin: event.plugin,
      type: event.type,
      direction: event.direction,
      timestamp: event.timestamp,
      chain: event.chain,
      txHash: event.ctx.txHash,
      logIndex: event.ctx.logIndex,
      srcChain,
      dstChain,
      args: JSON.stringify(event.args, (_, value) =>
        typeof value === 'bigint' ? `BigInt(${value})` : value,
      ),
    }
  })
}

export function createEventsRouter() {
  return router({
    stats: publicProcedure.query(({ ctx }) => {
      return ctx.db.interopEvent.getStats()
    }),
    details: publicProcedure
      .input(InteropEventDetailsRequest)
      .query(({ ctx, input }) => {
        return getInteropEventDetails(ctx.db, input.kind, input.type)
      }),
  })
}
