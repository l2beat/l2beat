import type { Database, InteropEventRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

export type InteropEventKind =
  | 'all'
  | 'matched'
  | 'unmatched'
  | 'old-unmatched'
  | 'unsupported'

export interface InteropEventDetailsRecord {
  plugin: string
  type: string
  direction?: string
  timestamp: number
  chain: string
  txHash: string
  logIndex: number
  srcChain?: string
  dstChain?: string
  args: string
}

export async function getInteropEventsByType(
  db: Database,
  kind: InteropEventKind,
  type: string,
): Promise<InteropEventRecord[]> {
  if (kind === 'matched') {
    return await db.interopEvent.getByType(type, { matched: true })
  }

  if (kind === 'unmatched') {
    return await db.interopEvent.getByType(type, {
      matched: false,
      unsupported: false,
    })
  }

  if (kind === 'unsupported') {
    return await db.interopEvent.getByType(type, { unsupported: true })
  }

  if (kind === 'old-unmatched') {
    const now = new Date()
    const cutoffTime = new Date(now.toISOString())
    cutoffTime.setUTCHours(cutoffTime.getUTCHours() - 2)

    return await db.interopEvent.getByType(type, {
      matched: false,
      unsupported: false,
      oldCutoff: UnixTime.fromDate(cutoffTime),
    })
  }

  return await db.interopEvent.getByType(type)
}

export async function getInteropEventDetails(
  db: Database,
  kind: InteropEventKind,
  type: string,
): Promise<InteropEventDetailsRecord[]> {
  const events = await getInteropEventsByType(db, kind, type)

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
