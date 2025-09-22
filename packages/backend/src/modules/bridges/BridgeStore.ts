import type { BridgeEventRecord, Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import { InMemoryEventDb } from './InMemoryEventDb'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventQuery,
  BridgeEventType,
} from './plugins/types'

export class BridgeStore implements BridgeEventDb {
  private eventDb = new InMemoryEventDb()
  private unmatched: BridgeEvent[] = []

  private newEvents: BridgeEvent[] = []
  private newMatched = new Set<string>()
  private newUnsupported = new Set<string>()

  constructor(private db: Database) {}

  async start() {
    const records = await this.db.bridgeEvent.getAll()
    for (const record of records) {
      const event = fromDbRecord(record)
      if (!record.matched && !record.unsupported) {
        this.eventDb.addEvent(event)
        this.unmatched.push(event)
      }
    }
  }

  addEvent(event: BridgeEvent) {
    this.eventDb.addEvent(event)
    this.unmatched.push(event)
    this.newEvents.push(event)
  }

  markMatched(eventIds: string[]) {
    for (const eventId of eventIds) {
      this.newMatched.add(eventId)
    }
    this.unmatched = this.unmatched.filter(
      (x) => !this.newMatched.has(x.eventId),
    )
  }

  markUnsupported(eventIds: string[]) {
    for (const eventId of eventIds) {
      this.newUnsupported.add(eventId)
    }
    this.unmatched = this.unmatched.filter(
      (x) => !this.newUnsupported.has(x.eventId),
    )
  }

  getUnmatched(): BridgeEvent[] {
    return this.unmatched
  }

  async save(): Promise<void> {
    const records = this.newEvents.map((e) =>
      toDbRecord(e, {
        matched: this.newMatched.has(e.eventId),
        unsupported: this.newUnsupported.has(e.eventId),
      }),
    )
    const matchedIds = Array.from(this.newMatched)
    const unsupportedIds = Array.from(this.newUnsupported)

    this.newEvents.length = 0
    this.newMatched.clear()
    this.newUnsupported.clear()

    await this.db.transaction(async () => {
      await this.db.bridgeEvent.insertMany(records)
      await this.db.bridgeEvent.updateMatched(matchedIds)
      await this.db.bridgeEvent.updateUnsupported(unsupportedIds)
    })
  }

  async deleteExpired(now: UnixTime) {
    for (const event of this.unmatched) {
      if (event.expiresAt <= now) {
        this.newMatched.delete(event.eventId)
        this.newUnsupported.delete(event.eventId)
        this.eventDb.removeEvent(event.eventId)
      }
    }
    this.unmatched = this.unmatched.filter((x) => x.expiresAt > now)
    this.newEvents = this.newEvents.filter((x) => x.expiresAt > now)
    await this.db.bridgeEvent.deleteExpired(now)
  }

  find<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T> | undefined {
    return this.eventDb.find(type, query)
  }

  findAll<T>(
    type: BridgeEventType<T>,
    query: BridgeEventQuery<T>,
  ): BridgeEvent<T>[] {
    return this.eventDb.findAll(type, query)
  }
}

export function getMatching<T>(
  events: BridgeEvent<T>[],
  query: BridgeEventQuery<T>,
): BridgeEvent<T>[] {
  const filtered = events.filter((e) => matchesQuery(e, query))
  if (query.sameTxAfter) {
    events.sort((a, b) => a.ctx.logIndex - b.ctx.logIndex)
  } else if (query.sameTxBefore) {
    events.sort((a, b) => b.ctx.logIndex - a.ctx.logIndex)
  }
  return filtered
}

function matchesQuery<T>(
  event: BridgeEvent<T>,
  query: BridgeEventQuery<T>,
): boolean {
  for (const key in query) {
    if (key === 'ctx') {
      for (const ctxKey in query[key]) {
        // @ts-ignore
        if (event.ctx[ctxKey] !== query.ctx[ctxKey]) {
          return false
        }
      }
    } else if (key !== 'sameTxBefore' && key !== 'sameTxAfter') {
      // @ts-ignore
      if (event.args[key] !== query[key]) {
        return false
      }
    }
  }
  if (query.sameTxAfter) {
    if (
      event.ctx.chain !== query.sameTxAfter.ctx.chain ||
      event.ctx.txHash !== query.sameTxAfter.ctx.txHash ||
      event.ctx.logIndex <= query.sameTxAfter.ctx.logIndex
    ) {
      return false
    }
  }
  if (query.sameTxBefore) {
    if (
      event.ctx.chain !== query.sameTxBefore.ctx.chain ||
      event.ctx.txHash !== query.sameTxBefore.ctx.txHash ||
      event.ctx.logIndex >= query.sameTxBefore.ctx.logIndex
    ) {
      return false
    }
  }
  return true
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

function toDbRecord(
  event: BridgeEvent,
  flags: { matched: boolean; unsupported: boolean },
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
    matched: flags.matched,
    unsupported: flags.unsupported,
  }
}
