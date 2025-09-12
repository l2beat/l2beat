import type { BridgeEventRecord, Database } from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventType,
} from './plugins/types'

export class BridgeStore implements BridgeEventDb {
  private events = new Map<string, BridgeEvent[]>()
  private unmatched: BridgeEvent[] = []
  private matchedIds = new Set<string>()
  private unsupportedIds = new Set<string>()

  private newEvents: BridgeEvent[] = []
  private newMatched = new Set<string>()
  private newUnsupported = new Set<string>()

  constructor(private db: Database) {}

  async start() {
    const records = await this.db.bridgeEvent.getAll()
    for (const record of records) {
      const event = fromDbRecord(record)
      this.categorizeEvent(event)

      if (!record.matched) {
        this.unmatched.push(event)
      } else {
        this.matchedIds.add(event.eventId)
      }

      if (record.unsupported) {
        this.unsupportedIds.add(event.eventId)
      }
    }
  }

  addEvent(event: BridgeEvent) {
    this.categorizeEvent(event)
    this.unmatched.push(event)
    this.newEvents.push(event)
  }

  private categorizeEvent(event: BridgeEvent) {
    const array = this.events.get(event.type) ?? []
    array.push(event)
    this.events.set(event.type, array)
  }

  markMatched(eventIds: string[]) {
    for (const eventId of eventIds) {
      this.matchedIds.add(eventId)
      this.newMatched.add(eventId)
    }
    this.unmatched = this.unmatched.filter((x) => !eventIds.includes(x.eventId))
  }

  markUnsupported(eventIds: string[]) {
    for (const eventId of eventIds) {
      this.unsupportedIds.add(eventId)
      this.newUnsupported.add(eventId)
    }
    this.unmatched = this.unmatched.filter((x) => !eventIds.includes(x.eventId))
  }

  getUnmatched(): BridgeEvent[] {
    return [...this.unmatched]
  }

  async save(): Promise<void> {
    const records = this.newEvents.map((e) =>
      toDbRecord(e, {
        matched: this.matchedIds.has(e.eventId),
        unsupported: this.unsupportedIds.has(e.eventId),
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
    const expired = new Set<string>()
    for (const [type, events] of this.events.entries()) {
      let some = false
      for (const event of events) {
        if (event.expiresAt <= now) {
          some = true
          expired.add(event.eventId)
        }
      }
      if (some) {
        this.events.set(
          type,
          events.filter((x) => x.expiresAt > now),
        )
      }
    }

    this.unmatched = this.unmatched.filter((x) => x.expiresAt > now)
    this.newEvents = this.newEvents.filter((x) => x.expiresAt > now)

    for (const id of expired) {
      this.matchedIds.delete(id)
      this.newMatched.delete(id)
    }

    await this.db.bridgeEvent.deleteExpired(now)
  }

  find<T>(
    type: BridgeEventType<T>,
    query?: Partial<T>,
  ): BridgeEvent<T> | undefined {
    return this.events.get(type.type)?.find((a): a is BridgeEvent<T> => {
      if (!query) return true
      return matchesQuery(a.args, query)
    })
  }

  findAll<T>(type: BridgeEventType<T>, query?: Partial<T>): BridgeEvent<T>[] {
    return (
      this.events.get(type.type)?.filter((a): a is BridgeEvent<T> => {
        if (!query) return true
        return matchesQuery(a.args, query)
      }) ?? []
    )
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
