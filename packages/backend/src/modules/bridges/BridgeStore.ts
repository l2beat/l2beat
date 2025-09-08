import type { BridgeEventRecord, Database } from '@l2beat/database'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventType,
} from './plugins/types'

export class BridgeStore implements BridgeEventDb {
  private events: BridgeEvent[] = []
  private unmatched: BridgeEvent[] = []
  private groupedIds = new Set<string>()

  constructor(private db: Database) {}

  async start() {
    const records = await this.db.bridgeEvent.getAll()
    for (const record of records) {
      const event = fromDbRecord(record)
      if (!record.matched) {
        this.unmatched.push(event)
      }
      if (record.grouped) {
        this.groupedIds.add(record.eventId)
      }
      this.events.push(event)
    }
  }

  // TODO: implement!

  addEvent(event: BridgeEvent) {}
  markMatched(event: BridgeEvent) {}
  markGrouped(event: BridgeEvent) {}

  async flush(): Promise<void> {}

  getUnmatched(): BridgeEvent[] {
    return []
  }

  find<T>(
    type: BridgeEventType<T>,
    query?: Partial<T>,
  ): BridgeEvent<T> | undefined {
    return this.events.find((a): a is BridgeEvent<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.args, query)
    })
  }

  findAll<T>(type: BridgeEventType<T>, query?: Partial<T>): BridgeEvent<T>[] {
    return this.events.filter((a): a is BridgeEvent<T> => {
      if (!type.checkType(a)) return false
      if (!query) return true
      return matchesQuery(a.args, query)
    })
  }
}

function matchesQuery<T>(payload: T, query: Partial<T>): boolean {
  return Object.entries(query).every(([key, value]) => {
    // biome-ignore lint/suspicious/noExplicitAny: We want to do it old school
    return (payload as any)[key] === value
  })
}

function fromDbRecord(record: BridgeEventRecord): BridgeEvent {
  return {
    eventId: record.eventId,
    type: record.type,
    expiresAt: record.expiresAt,
    args: record.args,
    ctx: {
      chain: record.chain,
      blockHash: record.blockHash,
      blockNumber: record.blockNumber,
      logIndex: record.logIndex,
      timestamp: record.timestamp,
      txHash: record.txHash,
      txTo: record.txTo,
    },
  }
}

// biome-ignore lint/correctness/noUnusedVariables: TODO: use
function toDbRecord(
  event: BridgeEvent,
  options: { matched: boolean; grouped: boolean },
): BridgeEventRecord {
  return {
    eventId: event.eventId,
    type: event.type,
    expiresAt: event.expiresAt,
    args: event.args,
    chain: event.ctx.chain,
    blockHash: event.ctx.blockHash,
    blockNumber: event.ctx.blockNumber,
    logIndex: event.ctx.logIndex,
    timestamp: event.ctx.timestamp,
    txHash: event.ctx.txHash,
    txTo: event.ctx.txTo,
    matched: options.matched,
    grouped: options.grouped,
  }
}
