import type { BridgeEventRecord, Database } from '@l2beat/database'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgeEventType,
} from './plugins/types'

export class BridgeStore implements BridgeEventDb {
  private events = new Map<string, BridgeEvent[]>()
  private unmatched: BridgeEvent[] = []
  private matchedIds = new Set<string>()
  private groupedIds = new Set<string>()

  private newEvents: BridgeEvent[] = []
  private newMatched = new Set<string>()
  private newGrouped = new Set<string>()

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
      if (record.grouped) {
        this.groupedIds.add(event.eventId)
      }
    }
  }

  addEvent(event: BridgeEvent) {
    this.categorizeEvent(event)
    this.newEvents.push(event)
  }

  private categorizeEvent(event: BridgeEvent) {
    const array = this.events.get(event.type) ?? []
    array.push(event)
    this.events.set(event.type, array)
  }

  markMatched(event: BridgeEvent) {
    this.matchedIds.add(event.eventId)
    this.newMatched.add(event.eventId)
    this.markGrouped(event)

    const index = this.unmatched.indexOf(event)
    if (index !== -1) {
      this.unmatched.splice(index, 1)
    }
  }

  markGrouped(event: BridgeEvent) {
    this.groupedIds.add(event.eventId)
    this.newGrouped.add(event.eventId)
  }

  getUnmatched(): BridgeEvent[] {
    return [...this.unmatched]
  }

  async save(): Promise<void> {
    const records = this.newEvents.map((e) =>
      toDbRecord(e, {
        matched: this.matchedIds.has(e.eventId),
        grouped: this.groupedIds.has(e.eventId),
      }),
    )
    const matchedIds = Array.from(this.newMatched)
    const groupedIds = Array.from(this.newGrouped).filter(
      (x) => !this.matchedIds.has(x),
    )

    this.newEvents.length = 0
    this.newMatched.clear()
    this.newGrouped.clear()

    await this.db.transaction(async () => {
      await this.db.bridgeEvent.insertMany(records)
      await this.db.bridgeEvent.updateMatched(matchedIds)
      await this.db.bridgeEvent.updateGrouped(groupedIds)
    })
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
